import fs from "node:fs";
import path from "node:path";
import { sveltekit } from "@sveltejs/kit/vite";
import houdini from "houdini/vite";
import { type UserConfig, defineConfig } from "vite";

const config: UserConfig = {
	plugins: [houdini(), sveltekit()],
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
