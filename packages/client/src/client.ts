import { HoudiniClient } from "$houdini";
import { createClient } from "graphql-ws";
import { subscription } from "$houdini/plugins";
import { ORUG_CONFIG } from "$lib/config";

const { torii } = ORUG_CONFIG.endpoints;

export default new HoudiniClient({
	url: `${torii.http}/graphql`,
	plugins: [
		subscription(() =>
			createClient({
				url: `${torii.ws}/graphql`,
			}),
		),
	],
});
