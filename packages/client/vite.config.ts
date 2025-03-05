import fs from "node:fs";
import path from "node:path";
import { sveltekit } from "@sveltejs/kit/vite";
import { type UserConfig, defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { patchBindings } from "./scripts/vite-fix-bindings";
import tailwindcss from "@tailwindcss/vite";

const config: UserConfig = {
	plugins: [
		sveltekit(),
		wasm(),
		topLevelAwait(),
		tailwindcss(),
		patchBindings(), // Patcher for `models.gen.ts` starknet BigNumberish type import
	],
	build: {
		target: "esnext",
	},
	server: {
		// add SSL certificates
		https: {
			key: fs.readFileSync(path.resolve(__dirname, "ssl", "localhost-key.pem")), // Path to your private key
			cert: fs.readFileSync(path.resolve(__dirname, "ssl", "localhost-cert.pem")), // Path to your certificate
		},
		cors: true,
	},
};

export default defineConfig(config);
