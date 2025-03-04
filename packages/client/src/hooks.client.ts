import { browser } from "$app/environment";
import { InitDojo } from "$lib/dojo";
import { Dojo_Config, Dojo_Outputter } from "$lib/stores/dojo_store";
import type { ClientInit } from "@sveltejs/kit";

export const init: ClientInit = async () => {
	const registerDojo = async () => {
		const dojoConfig = await InitDojo(Dojo_Outputter);
		Dojo_Config.set(dojoConfig);
	};
	registerDojo();
};
