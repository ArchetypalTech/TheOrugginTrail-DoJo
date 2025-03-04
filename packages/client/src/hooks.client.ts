import { InitDojo } from "$lib/dojo";
import { Dojo_Config, Dojo_Outputter } from "$lib/stores/dojo_store";
import type { ClientInit } from "@sveltejs/kit";

export const init: ClientInit = async () => {
	/** 
	/ @dev here we initialize the Dojo config, ClientInit hook fires only once
	/ */
	const registerDojo = async () => {
		const dojoConfig = await InitDojo();

		// Set config to the store for usage in the client
		Dojo_Config.set(dojoConfig);
	};
	registerDojo();
};
