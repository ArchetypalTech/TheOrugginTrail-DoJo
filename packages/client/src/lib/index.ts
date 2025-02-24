// place files you want to import through the `$lib` alias in this folder.
import {
	RpcProvider,
	Account,
	json,
	Contract,
	CallData,
	byteArray,
} from "starknet";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export * from "./system";
import { Katana, Manifest_Addresses } from "../be_fe_constants";
import manifest from "@zorg/contracts/manifest_dev.json";

// ES6 work around for getting project relative paths
// const filepath = setFilePath('../manifest/outputter.json') // => filepath()
export const setFilePath = (target: string) => {
	// relative to $lib
	return () => {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		return path.resolve(__dirname, target);
	};
};

// make this go away into a setup function
// File is the one with -> drop implementation
const MANIFEST = setFilePath(
	"../manifest/the_oruggin_trail_meatpuppet.contract_class_v2.json",
);

// SYSTEM CALLS
// import these based on the contract abi's
export const systemCalls = {
	sendMessage,
};

// MUTATATION | ACTION | POST
/**
 * This should take a msg type that we parse out from the
 * contract abi's but right now we dont: FIXME!!
 *
 * @param message
 * @returns
 */
export async function sendMessage(message: string) {
	console.log("MSG: ", message);
	const cmds_raw = message.split(/\s+/);
	const cmds = cmds_raw.filter((word) => word !== "");
	console.log(cmds);
	/**
	 * NO! this need to be passed the endpoint form the env or somewhere
	 * worth remebering that `katana` doesnt listen on `localhost:*`
	 */
	const katanaProvider: RpcProvider = new RpcProvider({
		nodeUrl: Katana.KATANA_ENDPOINT,
	});
	const burnerAccount: Account = new Account(
		katanaProvider,
		Katana.addr,
		Katana.pKey,
	);

	// now get the contract abi's from the manifest and make a starknet contract
	const contractAbi = manifest.contracts.find(
		(x) => x.tag === "the_oruggin_trail-meatpuppet",
	)!;
	if (contractAbi === undefined) {
		throw new Error("contractAbi is undefined");
	}
	const theOutputter: Contract = new Contract(
		contractAbi.abi,
		Manifest_Addresses.ENTITY_ADDRESS,
		katanaProvider,
	);

	// connect the account to the contract
	theOutputter.connect(burnerAccount);
	// create message as readable contract data
	const cmd_array = cmds.map((cmd) => {
		return byteArray.byteArrayFromString(cmd);
	});
	// console.log(cmd_array);
	const calldata = CallData.compile([cmd_array, 23]);
	console.log("sending");
	console.log(calldata);
	// ionvoke the contract as we are doing a write
	let response = await theOutputter.invoke("listen", [calldata]);

	return new Response(JSON.stringify(response), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}

// How we expect to use a standard RPC call
async function standardRPC() {
	// get bacon. shoot laser. win
	const params = {
		contractName: "outputter",
		entrypoint: "updateOutput",
		calldata: ["foo"],
	};

	const body = JSON.stringify({
		jsonrpc: "2.0",
		method: "starknet_chainId",
		params,
		id: 1,
	});

	const response = await fetch(Katana.KATANA_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body,
	});
}
