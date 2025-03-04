import { ORUG_CONFIG } from "./config";
import { createDojoConfig, DojoProvider } from "@dojoengine/core";
import { init } from "@dojoengine/sdk";
import {
	type SchemaType,
	schema,
} from "@zorg/contracts/bindings/typescript/models.gen";

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

	const db = await init<SchemaType>(sdkConfig);

	const provider = new DojoProvider(manifest, rpcUrl);

	return { db, dojoConfig, provider };
};
