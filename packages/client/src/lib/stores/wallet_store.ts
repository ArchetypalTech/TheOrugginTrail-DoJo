import { get, writable } from "svelte/store";
import { wallet, type AccountInterface } from "starknet";
import Controller, { type ControllerOptions } from "@cartridge/controller";
import { ORUG_CONFIG } from "$lib/config";

export interface WalletStore {
	accountController: AccountInterface | undefined;
	username: string | undefined;
	walletAddress: string | undefined;
	controller: Controller | undefined;
	isConnected: boolean;
	isLoading: boolean;
}

export const walletStore = writable<WalletStore>({
	accountController: undefined,
	username: undefined,
	walletAddress: undefined,
	controller: undefined,
	isConnected: false,
	isLoading: false,
});

export const setWalletData = (data: Partial<WalletStore>) => {
	walletStore.update((store) => {
		return {
			...store,
			...data,
		};
	});
};

export const setupController = async () => {
	const worldName = ORUG_CONFIG.manifest.default.world.name;
	// const methods = ORUG_CONFIG.contracts.entity.abi.map((method) => ({
	// 	entryPoint: method.name,
	// 	description: `Approve submitting transactions to play ${worldName}`,
	// }));
	const controllerConfig = {
		colorMode: "dark",
		theme: "", //"here will go our theme that needs to be designed and added",
		// Policies are required to be defined better
		policies: {
			contracts: {
				[ORUG_CONFIG.manifest.entity.address]: {
					name: worldName, // Optional, can be added if you want a name
					description: `Approve or reject submitting transactions to play ${worldName}`,
					methods: [
						// ...methods,
						{
							entrypoint: "listen", // The actual method name
							description: `Approve submitting transactions to play ${worldName}`,
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
				rpcUrl: ORUG_CONFIG.endpoints.katana,
			},
		],
		defaultChainId: ORUG_CONFIG.token.chainId,
		tokens: {
			erc20: ORUG_CONFIG.token.erc20,
			//erc721: [addrContract],
		},
		slot: ORUG_CONFIG.env.VITE_SLOT,
	} satisfies ControllerOptions;
	try {
		const controller = new Controller(controllerConfig);
		setWalletData({
			controller,
		});
		// controller.on("accountsChanged", async () => {
		// 	const username = await controller.username();
		// 	setWalletData({
		// 		isConnected: true,
		// 		username,
		// 	});
		// });
		// controller.on("networkChanged", async () => {
		// 	// connectedToCGC.set(false);
		// });
		return controller;
	} catch (e) {
		console.error("Error creating controller", e);
	}
};

if (import.meta.env.MODE === "slot") {
	const controller = await setupController();
}

export const connectController = async () => {
	const wallet = get(walletStore);
	if (wallet.isConnected) {
		return;
	}
	setWalletData({ isLoading: true });
	try {
		const controller = get(walletStore).controller;
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
	get(walletStore).controller?.openProfile("inventory");
};

export const disconnectController = async () => {
	get(walletStore).controller?.disconnect(); // Disconnect the controller
	setWalletData({
		accountController: undefined,
		username: undefined,
		walletAddress: undefined,
		isConnected: false,
	});
};
