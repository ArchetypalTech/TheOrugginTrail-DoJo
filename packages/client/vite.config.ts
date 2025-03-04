import fs from "node:fs";
import path from "node:path";
import { sveltekit } from "@sveltejs/kit/vite";
import houdini from "houdini/vite";
import { type UserConfig, defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

const config: UserConfig = {
	plugins: [houdini(), sveltekit(), wasm(), topLevelAwait()],
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
