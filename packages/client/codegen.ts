import type { CodegenConfig } from "@graphql-codegen/cli";
import { toriiRPC } from "./src/be_fe_constants";

const config: CodegenConfig = {
	schema: `${toriiRPC}/graphql`,
	documents: ["src/**/*.{svelte,ts,js}"],
	generates: {
		"./src/gql/": {
			preset: "client",
		},
	},
};
export default config;
