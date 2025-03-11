// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type config from "../orug.config";

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface ImportMetaEnv {
		/**
		 * @dev Use process.env or import.meta.env instead */
		env: {
			ORUG_CONFIG: typeof config;
		};
	}
}
