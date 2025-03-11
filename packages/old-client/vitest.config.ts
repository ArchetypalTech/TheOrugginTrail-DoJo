import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["./src/tests/**/*.{test,spec}.{js,ts}"],
		globals: true,
	},
	resolve: {
		alias: {
			"@tests": path.resolve(__dirname, "./src/tests"),
			$lib: path.resolve(__dirname, "./src/lib"),
		},
	},
});
