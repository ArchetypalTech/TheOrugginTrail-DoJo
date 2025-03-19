import type { WalletAccount } from "starknet";
import Controller, { type ControllerOptions } from "@cartridge/controller";
import { ZORG_CONFIG } from "@lib/config";
import { StoreBuilder } from "../utils/storebuilder";
import { APP_EDITOR_DATA } from "@/data/app.data";

/**
 * Interface representing the wallet state.
 * @interface WalletStore
 * @property {WalletAccount | undefined} account - The wallet account instance
 * @property {string | undefined} username - The user's username
 * @property {string | undefined} walletAddress - The wallet's address
 * @property {Controller | undefined} controller - The cartridge controller instance
 * @property {boolean} isConnected - Indicates if the wallet is connected
 * @property {boolean} isLoading - Indicates if wallet operations are in progress
 */
interface WalletStore {
	account: WalletAccount | undefined;
	username: string | undefined;
	walletAddress: string | undefined;
	controller: Controller | undefined;
	isConnected: boolean;
	isLoading: boolean;
}

const {
	get,
	set,
	createFactory,
	useStore: useWalletStore,
} = StoreBuilder<WalletStore>({
	account: undefined,
	username: undefined,
	walletAddress: undefined,
	controller: undefined,
	isConnected: false,
	isLoading: false,
});

/**
 * Sets up the Cartridge controller with required configuration.
 * Configures policies, chains, and tokens for the controller.
 * @returns {Promise<Controller | undefined>} The configured controller instance
 */
const setupController = async () => {
	const worldName = ZORG_CONFIG.manifest.default.world.name;
	const isEditor = window.location.pathname.startsWith("/editor");
	const editorConfig = {
		[ZORG_CONFIG.manifest.designer.address]: {
			name: APP_EDITOR_DATA.title, // Optional, can be added if you want a name
			description: `Aprove submitting transactions to ${APP_EDITOR_DATA.title}`,
			methods: [
				{
					entrypoint: "create_objects",
					description: `The terminal endpoint for ${APP_EDITOR_DATA.title}`,
				},
				{
					entrypoint: "create_actions",
					description: `The terminal endpoint for ${APP_EDITOR_DATA.title}`,
				},
				{
					entrypoint: "create_rooms",
					description: `The terminal endpoint for ${APP_EDITOR_DATA.title}`,
				},
				{
					entrypoint: "create_txts",
					description: `The terminal endpoint for ${APP_EDITOR_DATA.title}`,
				},
				{
					entrypoint: "create_txt",
					description: `The terminal endpoint for ${APP_EDITOR_DATA.title}`,
				},
			],
		},
	};
	const controllerConfig: ControllerOptions = {
		policies: {
			contracts: {
				[ZORG_CONFIG.manifest.entity.address]: {
					name: worldName, // Optional, can be added if you want a name
					description: `Aprove submitting transactions to ${worldName}`,
					methods: [
						{
							entrypoint: "listen",
							description: `The terminal endpoint for ${worldName}`,
						},
					],
				},
				...(isEditor ? editorConfig : {}),
				[ZORG_CONFIG.token.contract_address]: {
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
				rpcUrl: ZORG_CONFIG.env.VITE_KATANA_HTTP_RPC, // FIXME: workaround for endpoint being proxied
			},
		],
		defaultChainId: ZORG_CONFIG.token.chainId,
		tokens: {
			erc20: ZORG_CONFIG.token.erc20,
			//erc721: [addrContract],
		},
		slot: ZORG_CONFIG.env.VITE_SLOT,
	};

	try {
		const controller = new Controller(controllerConfig);
		set({
			controller,
		});
		return controller;
	} catch (e) {
		console.error("Error creating controller", e);
	}
};

/**
 * Connects to the wallet using the configured controller.
 * Sets wallet state including account, username, and address on successful connection.
 * @throws {Error} When controller is not found or connection fails
 */
const connectController = async () => {
	const wallet = get();
	if (wallet.isConnected) {
		return;
	}
	set({ isLoading: true });
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
			account: res,
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
		set(data);
	} catch (e) {
		console.error(e);
		throw e;
	} finally {
		set({ isLoading: false });
	}
};

/**
 * Opens the user profile in the Controller UI.
 * Navigates to the inventory section of the profile.
 */
const openUserProfile = () => {
	get().controller?.openProfile("inventory");
};

/**
 * Disconnects the wallet from the application.
 * Resets wallet state to default values.
 */
const disconnectController = async () => {
	get().controller?.disconnect(); // Disconnect the controller
	set({
		account: undefined,
		username: undefined,
		walletAddress: undefined,
		isConnected: false,
	});
};

/**
 * Factory function that returns wallet store state and methods.
 * Provides access to the entire wallet API in one object.
 * @returns {Object} Combined wallet state and methods
 */
const WalletStore = createFactory({
	setupController,
	connectController,
	openUserProfile,
	disconnectController,
});

export default WalletStore;
export { useWalletStore };

// Initialize controller if using slot configuration
if (ZORG_CONFIG.useController) {
	await setupController();
	const account = await get().controller?.probe();
	if (account !== undefined) {
		console.log("[Controller] connected");
		await connectController();
	}
}
