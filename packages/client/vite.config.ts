import { sveltekit } from "@sveltejs/kit/vite";
import houdini from "houdini/vite";
import { defineConfig, UserConfig } from "vite";
import path from "path"; // We need to import 'path' to use path.resolve
import fs from "fs"; // For reading the SSL certificate files

const config: UserConfig = {
	plugins: [houdini(), sveltekit()],
	build: {
		target: "esnext", // Use `esnext` for modern JavaScript features like top-level await
	},
	server: {
		https: {
			key: fs.readFileSync(path.resolve(__dirname, "ssl", "localhost-key.pem")), // Path to your private key
			cert: fs.readFileSync(
				path.resolve(__dirname, "ssl", "localhost-cert.pem"),
			), // Path to your certificate
		},
		proxy: {
			api: {
				target: "http://localhost:5050",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
		cors: true,
	},
};
export default defineConfig(config);
