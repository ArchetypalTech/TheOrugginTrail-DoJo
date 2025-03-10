import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { black, bgGreen } from "ansicolor";
import mkcert from "vite-plugin-mkcert";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { patchBindings } from "./scripts/vite-fix-bindings";

export default defineConfig(async ({ mode }) => {
	console.log(`\n🦨💕 ZORG IN (${mode}) MODE`);
	const isSlot = mode === "slot";
	const isProduction = mode === "production";
	if (!isProduction)
		console.info(
			black(
				bgGreen(
					" Mkcert may prompt for sudo password to generate SSL certificates. ",
				),
			),
		);

	return {
		plugins: [
			!isProduction &&
				mkcert({
					hosts: ["localhost", "*.localhost", "*.127.0.0.1"],
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
			minify: true,
			sourcemap: true,
			reportCompressedSize: false,
		},
		server: {
			cors: true,
		},
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				"@components": path.resolve(__dirname, "./src/components"),
				"@lib": path.resolve(__dirname, "./src/lib"),
				"@styles": path.resolve(__dirname, "./src/styles"),
				"@zorg/contracts/manifest": isSlot
					? "@zorg/contracts/manifest_slot.json"
					: "@zorg/contracts/manifest_dev.json",
			},
		},
	};
});
