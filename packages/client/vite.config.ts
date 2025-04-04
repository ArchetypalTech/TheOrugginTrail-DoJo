import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { black, bgGreen } from "ansicolor";
import mkcert from "vite-plugin-mkcert";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { patchBindings } from "./scripts/vite-fix-bindings";

//TODO: https://github.com/nksaraf/vinxi
// https://www.npmjs.com/package/wouter

export default defineConfig(async ({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
	console.log(`\n🦨💕 ZORG IN (${mode}) MODE`);
	const isSlot = mode === "slot";
	const isProd = mode === "production";
	const isDev = mode === "development";
	if (isSlot)
		console.info(
			black(
				bgGreen(
					" Mkcert may prompt for sudo password to generate SSL certificates. ",
				),
			),
		);

	return {
		plugins: [
			isSlot &&
				mkcert({
					hosts: ["localhost"],
					autoUpgrade: true,
					savePath: path.resolve(__dirname, "ssl"),
				}),
			wasm(),
			topLevelAwait(),
			tailwindcss(),
			react(),
			patchBindings(),
		],
		build: {
			target: "esnext",
			sourcemap: true,
			// minify: false,
			// terserOptions: {
			// compress: false,
			// mangle: false,
			// },
			// rollupOptions: {
			// 	output: {
			// 		manualChunks: {
			// 			"@dojoengine/core": ["@dojoengine/core"],
			// 			"@dojoengine/sdk": ["@dojoengine/sdk"],
			// 			"@cartridge/controller": ["@cartridge/controller"],
			// 			starknet: ["starknet"],
			// 		},
			// 	},
			// },
		},
		server: {
			proxy: {
				"/katana": {
					target: process.env.VITE_KATANA_HTTP_RPC,
					changeOrigin: true,
				},
			},
			cors: false,
		},
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				"@components": path.resolve(__dirname, "./src/components"),
				"@lib": path.resolve(__dirname, "./src/lib"),
				"@styles": path.resolve(__dirname, "./src/styles"),
				"@editor": path.resolve(__dirname, "./src/editor"),
				"@zorg/contracts/manifest": isSlot
					? "@zorg/contracts/manifest_slot.json"
					: "@zorg/contracts/manifest_dev.json",
			},
		},
	};
});
