import { ORUG_CONFIG } from "./config";
import { createDojoConfig, DojoProvider } from "@dojoengine/core";
import {
	init,
	ToriiQueryBuilder,
	type StandardizedQueryResult,
} from "@dojoengine/sdk";
import { type SchemaType, schema } from "./dojo/typescript/models.gen";
import type { Outputter } from "./stores/dojo_store";
import type { Writable } from "svelte/store";

export const InitDojo = async (store: Writable<Outputter>) => {
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

	const sdk = await init<SchemaType>(sdkConfig);

	const provider = new DojoProvider(manifest, rpcUrl);

	const query = (id: number = 23) => {
		const builder = new ToriiQueryBuilder<SchemaType>();
		const query = builder
			.addEntityModel("the_oruggin_trail-Output")
			// .addEntityModel("the_oruggin_trail-OutputValue")
			// .includeHashedKeys()
			// .withClause(
			// 	new ClauseBuilder()
			// 		.compose()
			// 		.and([
			// 			new ClauseBuilder().where(
			// 				"the_oruggin_trail-Output",
			// 				"playerId",
			// 				"Eq",
			// 				id,
			// 			),
			// 		])
			// 		.build(),
			// );
			.withOffset(0)
			.withLimit(1000);
		// .withClause(
		// 	new ClauseBuilder()
		// 		.where("the_oruggin_trail-Output", "playerId", "Eq", id)
		// 		.build(),
		// )
		// .includeHashedKeys();
		return query;
	};

	const sub = async (
		playerId: number,
		callback: (response: {
			data?: StandardizedQueryResult<SchemaType> | undefined;
			error?: Error;
		}) => void,
	) => {
		return await sdk.subscribeEntityQuery({
			query: query(playerId),
			callback,
		});
	};

	return { sdk, dojoConfig, provider, query, sub };
};
