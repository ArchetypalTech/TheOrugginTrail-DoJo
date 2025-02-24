/// <reference types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
	watchSchema: {
		url: "http://localhost:8080/graphql",
		interval: 1000, // Consider increasing this in development
		maxRetries: 3, // Fixed typo
		quiet: true,
		// Add error handler for schema watching
		onError: (err) => {
			console.warn("Schema watching failed:", err);
			return null; // Prevents crash
		},
	},
	plugins: {
		"houdini-svelte": {},
	},
	scalars: {
		felt252: {
			type: "YourType_felt252",
		},
		ByteArray: {
			type: "YourType_ByteArray",
		},
	},
	schemaPath: "./schema.graphql",
	sourceGlob: "src/**/*.{svelte,ts,js}",
	module: "esm",
	framework: "svelte",
};

export default config;
