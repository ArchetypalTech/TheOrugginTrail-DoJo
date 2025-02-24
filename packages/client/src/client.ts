import { HoudiniClient } from "$houdini";
import { createClient } from "graphql-ws";
import { subscription } from "$houdini/plugins";
import { toriiRPC, toriiWS } from "./be_fe_constants";

export default new HoudiniClient({
	url: `${toriiRPC}/graphql`,
	plugins: [
		subscription(() =>
			createClient({
				url: `${toriiWS}/graphql`,
			}),
		),
	],

	// uncomment this to configure the network call (for things like authentication)
	// for more information, please visit here: https://www.houdinigraphql.com/guides/authentication
	// fetchParams({ session }) {
	//     return {
	//         headers: {
	//             Authentication: `Bearer ${session.token}`,
	//         }
	//     }
	// }
});
