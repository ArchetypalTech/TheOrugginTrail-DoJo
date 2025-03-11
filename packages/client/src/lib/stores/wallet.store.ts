import type { WalletAccount } from "starknet";
import Controller, { type ControllerOptions } from "@cartridge/controller";
import { ORUG_CONFIG } from "@lib/config";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface WalletStore {
	accountController: WalletAccount | undefined;
	username: string | undefined;
	walletAddress: string | undefined;
	controller: Controller | undefined;
	isConnected: boolean;
	isLoading: boolean;
}

// Create initial state
const initialState: WalletStore = {
	accountController: undefined,
	username: undefined,
	walletAddress: undefined,
	controller: undefined,
	isConnected: false,
	isLoading: false,
};

export const useWalletStore = create<
	WalletStore & { set: (state: Partial<WalletStore>) => void }
>()(
	immer((set) => ({
		...initialState,
		set,
	})),
);

const get = () => useWalletStore.getState();
const set = useWalletStore.getState().set;

export const setWalletData = (data: Partial<WalletStore>) => {
	set(data);
};

export const setupController = async () => {
	const worldName = ORUG_CONFIG.manifest.default.world.name;
	const controllerConfig: ControllerOptions = {
		policies: {
			contracts: {
				[ORUG_CONFIG.manifest.entity.address]: {
					name: worldName, // Optional, can be added if you want a name
					description: `Aprove submitting transactions to ${worldName}`,
					methods: [
						{
							entrypoint: "listen",
							description: `The terminal endpoint for ${worldName}`,
						},
					],
				},
				[ORUG_CONFIG.token.contract_address]: {
					name: "TOT NFT", // Optional
					description: "Mint and transfer TOT tokens",
					methods: [
						{
							entrypoint: "mint", // The actual method name
							description: "Approve minting a TOT Token",
						},
						{
							entrypoint: "transfer_from", // The actual method name
							description: "Transfer a TOT Token",
						},
					],
				},
			},
		},
		chains: [
			{
				rpcUrl: ORUG_CONFIG.env.VITE_KATANA_HTTP_RPC, // FIXME: workaround for endpoint being proxied
			},
		],
		defaultChainId: ORUG_CONFIG.token.chainId,
		tokens: {
			erc20: ORUG_CONFIG.token.erc20,
			//erc721: [addrContract],
		},
		slot: ORUG_CONFIG.env.VITE_SLOT,
	};

	try {
		const controller = new Controller(controllerConfig);
		setWalletData({
			controller,
		});
		return controller;
	} catch (e) {
		console.error("Error creating controller", e);
	}
};

if (ORUG_CONFIG.useSlot) {
	await setupController();
}

export const connectController = async () => {
	const wallet = get();
	if (wallet.isConnected) {
		return;
	}
	setWalletData({ isLoading: true });
	try {
		const controller = get().controller;
		if (!controller) {
			throw new Error("No controller found");
		}
		const res = await controller.connect(); // Get response from the
		if (!res) {
			throw new Error("No response from Cartridge Game Controller");
		}
		const data = {
			accountController: res,
			username: await controller.username(),
			walletAddress: res.address,
			isConnected: true,
			isLoading: false,
			controller,
		} satisfies WalletStore;
		console.log(
			"[Controller] username:",
			data.username,
			"address:",
			data.walletAddress,
		);
		setWalletData(data);
	} catch (e) {
		console.error(e);
		throw e;
	} finally {
		setWalletData({ isLoading: false });
	}
};

export const openUserProfile = () => {
	get().controller?.openProfile("inventory");
};

export const disconnectController = async () => {
	get().controller?.disconnect(); // Disconnect the controller
	setWalletData({
		accountController: undefined,
		username: undefined,
		walletAddress: undefined,
		isConnected: false,
	});
};

const WalletStore = () => ({
	...useWalletStore.getState(),
	set: useWalletStore.setState,
	subscribe: useWalletStore.subscribe,
	setWalletData,
	setupController,
	connectController,
	openUserProfile,
	disconnectController,
});

export default WalletStore;
