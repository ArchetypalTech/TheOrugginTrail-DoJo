// place files you want to import through the `$lib` alias in this folder.
import { RpcProvider, Account, Contract, CallData, byteArray } from "starknet";

import { Katana, Manifest_Addresses } from "./be_fe_constants";
import manifest from "@zorg/contracts/manifest_dev.json";

// MUTATATION | ACTION | POST
/**
 * This should take a msg type that we parse out from the
 * contract abi's but right now we dont: // to do this we need to implement a full ABI parser to make sendmessage accept all the ABI functions
 *
 * @param message
 * @returns
 */
async function sendMessage(message: string) {
	console.log("sendMessage: ", message);
	const cmds_raw = message.split(/\s+/);
	const cmds = cmds_raw.filter((word) => word !== "");
	console.log("sendMessage(cmds): ", cmds);
	const cmd_array = cmds.map((cmd) => byteArray.byteArrayFromString(cmd));

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
	);
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
	// console.log(cmd_array);
	const calldata = CallData.compile([cmd_array, 23]);
	console.log("sendMessage(calldata): ", calldata);
	// ionvoke the contract as we are doing a write
	const response = await theOutputter.invoke("listen", [calldata]);

	return new Response(JSON.stringify(response), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}

export const SystemCalls = {
	sendMessage,
};
