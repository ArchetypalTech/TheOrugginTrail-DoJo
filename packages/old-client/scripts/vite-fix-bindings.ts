import fs from "node:fs";
import path from "node:path";
import type { Plugin, ViteDevServer } from "vite";

/**
 * Checks and fixes the import statement in the specified file
 * @param filePath - Path to the file to check and fix
 * @param server - Vite dev server instance
 * @returns {boolean} - True if a fix was applied, false otherwise
 */
function checkAndFixFile(filePath: string, server: ViteDevServer) {
	if (fs.existsSync(filePath)) {
		let content = fs.readFileSync(filePath, "utf-8");
		const incorrectImport =
			"import { CairoCustomEnum, BigNumberish } from 'starknet';";
		const correctImport =
			"import { CairoCustomEnum, type BigNumberish } from 'starknet';";

		if (content.includes(incorrectImport)) {
			content = content.replace(incorrectImport, correctImport);
			fs.writeFileSync(filePath, content);
			// Force Vite to reload
			server.restart();
			return true;
		}
	}
	return false;
}

/**
 * Vite plugin that fixes the BigNumberish import in models.gen.ts
 * Ensures the import includes the 'type' keyword for proper type imports
 *
 * The plugin runs in two scenarios:
 * 1. When the Vite dev server starts
 * 2. When the models.gen.ts file is modified (via HMR)
 *
 * @returns {Plugin} Vite plugin
 */
export function patchBindings(): Plugin {
	return {
		name: "fix-bindings",
		configureServer(server) {
			const modelsPath = path.resolve(
				__dirname,
				"../src/lib/dojo_bindings/typescript/models.gen.ts",
			);
			checkAndFixFile(modelsPath, server);
		},
		handleHotUpdate({ file, server }) {
			const modelsPath = path.resolve(
				__dirname,
				"../src/lib/dojo_bindings/typescript/models.gen.ts",
			);

			if (path.normalize(file) === path.normalize(modelsPath)) {
				checkAndFixFile(modelsPath, server);
			}
		},
	};
}
