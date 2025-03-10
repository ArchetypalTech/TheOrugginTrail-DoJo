// import { InitDojo } from "$lib/dojo";
// import { Dojo_Config } from "$lib/stores/dojo_store";
import { ORUG_CONFIG } from "$lib/config";
import { createDojoConfig, DojoProvider } from "@dojoengine/core";
import { init as dojoInit, ToriiQueryBuilder } from "@dojoengine/sdk";
import { schema } from "$lib/dojo_bindings/typescript/models.gen";

/**
 * ## Initializes the Dojo SDK and configuration
 * @dev @dojoengine/sdk has WASM components which cannot be linked to in other parts of the client
 * @returns {Promise} An object containing the initialized SDK, config, provider, and query functions
 */
export const InitDojo = async () => {
	const manifest = ORUG_CONFIG.manifest.default;
	const rpcUrl = ORUG_CONFIG.endpoints.katana;
	const dojoConfig = createDojoConfig({
		manifest,
	});

	const sdkConfig = {
		client: {
			rpcUrl,
			toriiUrl: ORUG_CONFIG.endpoints.torii.http,
			relayUrl: "/ip4/127.0.0.1/tcp/9090/tcp/80",
			worldAddress: dojoConfig.manifest.world.address,
		},
		// Those values are used
		domain: {
			name: "Orug",
			version: "1.0",
			chainId: "KATANA",
			revision: "1",
		},
		schema,
	};

	const sdk = await dojoInit(sdkConfig);

	const provider = new DojoProvider(manifest, rpcUrl);

	/**
	 * Creates a query for a player
	 * @param {number} id - Player ID to query
	 * @returns The query builder result
	 */
	const query = (id = 23) => {
		const builder = new ToriiQueryBuilder();
		return builder.addEntityModel("the_oruggin_trail-Output").build();
	};

	/**
	 * Subscribe to entity updates
	 * @deprecated currently outdated - please use the newer implementation
	 * @param {number} playerId - The player ID to subscribe to
	 * @param {Function} callback - Callback function for subscription updates
	 * @returns {Promise} Subscription result
	 */
	const sub = async (playerId, callback) => {
		return await sdk.subscribeEntityQuery({
			query: query(playerId),
			callback,
		});
	};

	return {
		sdk,
		config: dojoConfig,
		provider,
		query,
		sub,
	};
};

/**
 * Initialize the Dojo environment
 * @returns {Promise<string>} Initialization message
 */
export const init = async () => {
	const registerDojo = async () => {
		const dojo = await InitDojo();
		// Dojo_Config.set(dojo);
	};
	console.log("fuck you");
	await registerDojo();
	return "Initialized Dojo";
};
