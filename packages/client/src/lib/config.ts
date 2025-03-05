import manifestJson from "@zorg/contracts/manifest_dev.json";
import { url, cleanEnv, host, str } from "envalid";
import { Account, Contract, RpcProvider } from "starknet";

const getOrFail = <T>(value: T | undefined, name?: string): T => {
	if (value === undefined || value === null) {
		throw new Error(name ? `Value {${name}} is undefined` : "Value is undefined");
	}
	return value;
};

const env = cleanEnv(import.meta.env, {
	VITE_CONTROLLER_CHAINID: str(),
	VITE_TOKEN_HTTP_RPC: url(),
	VITE_TOKEN_CONTRACT_ADDRESS: str(),
	VITE_KATANA_HTTP_RPC: url(),
	VITE_TORII_HTTP_RPC: url(),
	VITE_TORII_WS_RPC: str(),
	VITE_BURNER_ADDRESS: str(),
	VITE_BURNER_PRIVATE_KEY: str(),
});

const endpoints = {
	katana: env.VITE_KATANA_HTTP_RPC,
	torii: {
		http: env.VITE_TORII_HTTP_RPC,
		ws: env.VITE_TORII_WS_RPC,
	},
};

const katanaProvider = new RpcProvider({
	nodeUrl: env.VITE_KATANA_HTTP_RPC,
});

// @dev: for future ref we can dynamically import manifest as well
// const mf = await import("@zorg/contracts/manifest_dev.json");
// console.log(mf.default);
const manifest = {
	default: manifestJson,
	entity: getOrFail(
		manifestJson.contracts.find((c) => c.tag === "the_oruggin_trail-meatpuppet"),
		"the_oruggin_trail-meatpuppet",
	),
	outputter: getOrFail(
		manifestJson.contracts.find((c) => c.tag === "the_oruggin_trail-outputter"),
		"the_oruggin_trail-outputter",
	),
	world: manifestJson.world,
};

const wallet = (() => {
	const address = env.VITE_BURNER_ADDRESS;
	const private_key = env.VITE_BURNER_PRIVATE_KEY;
	const account = new Account(katanaProvider, address, private_key);
	return {
		address,
		private_key,
		account,
	};
})();

const theOutputter = new Contract(
	manifest.entity.abi,
	manifest.entity.address,
	katanaProvider,
);

theOutputter.connect(wallet.account);

export const ORUG_CONFIG = {
	endpoints,
	katanaProvider,
	theOutputter,
	wallet,
	manifest,
	token: {
		provider: env.VITE_TOKEN_HTTP_RPC,
		// starkli chain-id --rpc https://api.cartridge.gg/x/theoruggintrail/katana
		chainId: env.VITE_CONTROLLER_CHAINID,
		// Contract address for the TOT NFT Token
		contract_address: env.VITE_TOKEN_CONTRACT_ADDRESS,
		erc20: ["0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"],
	},
	env: env,
};
