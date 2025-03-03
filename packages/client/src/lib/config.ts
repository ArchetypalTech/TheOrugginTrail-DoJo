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

	// katana default accounts
	default_address:
		"0x6677fe62ee39c7b07401f754138502bab7fac99d2d3c5d37df7d1c6fab10819",
	default_private_key:
		"0x3e3979c1ed728490308054fe357a9f49cf67f80f9721f44cc57235129e090f4",
};

export const Manifest_Addresses = {
	// meatpuppet
	ENTITY_ADDRESS: manifest.contracts[0].address,
	// outputter
	OUTPUTTER_ADDRESS: manifest.contracts[1].address,
	// the world
	WORLD_ADDRESS: manifest.world.address,
};

// @deprecated: fix the naming of this or delete this
export const ETH_CONTRACT =
	"0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
