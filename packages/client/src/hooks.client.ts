import { InitDojo } from "$lib/dojo";

const registerDojo = async () => {
	const dojoConfig = await InitDojo();
	Object.assign(window, dojoConfig);
	console.log("registered");
};

registerDojo();
