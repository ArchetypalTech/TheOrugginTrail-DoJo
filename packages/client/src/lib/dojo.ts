import { ZORG_CONFIG } from "@lib/config";
import { createDojoConfig, DojoProvider } from "@dojoengine/core";
import {
	init,
	ToriiQueryBuilder,
	type StandardizedQueryResult,
} from "@dojoengine/sdk";
import {
	type SchemaType,
	schema,
} from "@lib/dojo_bindings/typescript/models.gen";

/**
 * ## Initializes the Dojo SDK and configuration
 * @dev @dojoengine/sdk has WASM components which cannot be linked to in other parts of the client
 * @warning
 * ### 🚸 after a fresh sozo build of the bindings you may see a `BigNumberish` error in `models.gen.ts`
 * this can be fixed by prefixing the import with `'type'`
 * #### Example: `import { CairoCustomEnum, type BigNumberish } from "starknet"`
 * @returns An object containing the initialized SDK, config, provider, and query functions
 */
export const InitDojo = async () => {
	const manifest = ZORG_CONFIG.manifest.default;
	const rpcUrl = ZORG_CONFIG.endpoints.katana;
	const dojoConfig = createDojoConfig({
		manifest,
	});

	const sdkConfig = {
		client: {
			rpcUrl,
			toriiUrl: ZORG_CONFIG.endpoints.torii.http,
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

	const sdk = await init<SchemaType>(sdkConfig);

	const provider = new DojoProvider(manifest, rpcUrl);

	const query = () => {
		const builder = new ToriiQueryBuilder<SchemaType>();
		const query = builder
			.addEntityModel("the_oruggin_trail-Output")
			.withOffset(0)
			.withLimit(1000);
		return query;
	};

	/**
	 * Dojo Entity Subscription Query
	 */
	const sub = async (
		callback: (response: {
			data?: StandardizedQueryResult<SchemaType> | undefined;
			error?: Error;
		}) => void,
	) => {
		return await sdk.subscribeEntityQuery({
			query: query(),
			callback,
		});
	};

	return { sdk, dojoConfig, provider, query, sub };
};
