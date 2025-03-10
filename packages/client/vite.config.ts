import fs from "node:fs";
import path from "node:path";
import { sveltekit } from "@sveltejs/kit/vite";
import { type UserConfig, defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { patchBindings } from "./scripts/vite-fix-bindings";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";
import { bgGreen, black } from "ansicolor";

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
	const config: UserConfig = {
		plugins: [
			sveltekit(),
			!isProduction &&
				mkcert({
					hosts: ["localhost", "*.localhost", "*.127.0.0.1"],
					autoUpgrade: true,
					savePath: path.resolve(__dirname, "ssl"),
				}),
			tailwindcss(),
			wasm(),
			topLevelAwait(),
			patchBindings(), // Patcher for `models.gen.ts` starknet BigNumberish type import
		],
		build: {
			target: "esnext",
			minify: false,
			sourcemap: true,
		},
		server: {
			cors: true,
		},
		resolve: {
			alias: {
				"@zorg/contracts/manifest.json": isSlot
					? "@zorg/contracts/manifest_slot.json"
					: "@zorg/contracts/manifest_dev.json",
			},
		},
	};

	return config;
});
