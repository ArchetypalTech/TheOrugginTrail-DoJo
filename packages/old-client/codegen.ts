import type { CodegenConfig } from "@graphql-codegen/cli";
import { ORUG_CONFIG } from "./src/lib/config";

const config: CodegenConfig = {
	schema: `${ORUG_CONFIG.endpoints.torii.http}/graphql`,
	documents: ["src/**/*.{svelte,ts,js}"],
	generates: {
		"./src/gql/": {
			preset: "client",
		},
	},
};
export default config;
