import manifest from "@zorg/contracts/manifest_dev.json";

export const katanaRPC =
	// import.meta.env.DEV
	// ? "https://api.cartridge.gg/x/theoruggintrail/katana"
	// :
	"http://localhost:5050";
export const toriiRPC =
	// import.meta.env.DEV
	// ? "https://api.cartridge.gg/x/theoruggintrail/torii"
	// :
	"http://localhost:8080";
export const toriiWS =
	// import.meta.env.DEV
	// ? "wss://api.cartridge.gg/x/theoruggintrail/torii"
	// :
	"ws://localhost:8080";

// Katana burner account
export const Katana = {
	// Endpoint connection to Katana. // fish this from an env file if in local mode
	KATANA_ENDPOINT: katanaRPC,

	// this should be a burner account deployed on Katana by default
	// we be using `controller`at this point in the astartup logic
	// but right now this is in dev mode and comes direct from katana as its default accounts
	addr: "0x6677fe62ee39c7b07401f754138502bab7fac99d2d3c5d37df7d1c6fab10819",
	pKey: "0x3e3979c1ed728490308054fe357a9f49cf67f80f9721f44cc57235129e090f4",
};

export const Manifest_Addresses = {
	// fish this from the manifest file also we need all of them
	// meatpuppet
	// cat TeamPainClient/src/manifest/manifest_dev.json | jq -r '.contracts[0].address'
	// cat TeamPainClient/src/manifest/manifest_slot.json | jq -r '.contracts[0].address'
	// manifest_slot
	//ENTITY_ADDRESS: '0x6f758cfd367ac46b8cae5b74770503253f0fd090097cfb0d8772ce275ea1376',
	// manifest_slot_v2 -> with drop implementation
	ENTITY_ADDRESS: manifest.contracts[0].address, //'0x7e23776ff1349818ff81333008f7ad18554ad6d31a44944632f3985a62a1a9b',

	// outputter
	// cat ~TeamPainClient/src/manifest/manifest_dev.json | jq -r '.contracts[1].address'
	// cat TeamPainClient/src/manifest/manifest_slot.json | jq -r '.contracts[1].address'
	// manifest_slot
	//OUTPUTTER_ADDRESS: '0x743573d012b712630f5c2a0b4d0ce8886986e9cac50e294dee45b7298106589',
	// manifest_slot_v2 -> with drop implementation
	OUTPUTTER_ADDRESS: manifest.contracts[1].address, //'0x743573d012b712630f5c2a0b4d0ce8886986e9cac50e294dee45b7298106589',

	// the world
	// cat TeamPainClient/src/manifest/manifest_dev.json | jq -r '.world.address'
	// cat TeamPainClient/src/manifest/manifest_slot.json | jq -r '.world.address'
	WORLD_ADDRESS: manifest.world.address, //'0x067631b711ce310b8e6b32fb88f5427244534dba2a2584bb07c35256f618affa',
};

export const ETH_CONTRACT =
	"0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
