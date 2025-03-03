import { SystemCalls } from "$lib";
import manifest from "@zorg/contracts/manifest_dev.json";
import {
	Account,
	CallData,
	Contract,
	RpcProvider,
	byteArray,
	json,
} from "starknet";
import { ORUG_CONFIG } from "../../lib/config";
import type { RequestHandler } from "./$types";

// POST on route /api
export const POST: RequestHandler = async (event) => {
	console.log("SERVER POST> POST");
	console.log("===", event.request.url);
	const data = await event.request.formData();
	const command = data.get("entry") as string;
	// log recieving POST
	console.log("Send message to katana", command);
	return SystemCalls.sendMessage(command);
};

/**
 * make get request from client
 * */
export const GET: RequestHandler = async () => {
	console.log("SERVER GET> GET");
	console.log("----------------> GET");

	// set up the provider and account. Writes are not free
	const katanaProvider: RpcProvider = new RpcProvider({
		nodeUrl: ORUG_CONFIG.endpoints.katana,
	});
	const burnerAccount: Account = new Account(
		katanaProvider,
		ORUG_CONFIG.wallet.address,
		ORUG_CONFIG.wallet.private_key,
	);

	// read in the compiled contract abi
	const contractAbi = manifest.contracts.find(
		(x) => x.tag === "the_oruggin_trail-meatpuppet",
	)!;

	const theOutputter: Contract = new Contract(
		contractAbi.abi,
		ORUG_CONFIG.manifest.outputter.address,
		katanaProvider,
	);

	// connect the account to the contract
	theOutputter.connect(burnerAccount);

	// call it baby
	const calldata = CallData.compile([byteArray.byteArrayFromString("foobar")]);

	const response = await theOutputter.invoke("updateOutput", [calldata]);
	await katanaProvider.waitForTransaction(response.transaction_hash);
	console.log("==================================");
	console.log(response.transaction_hash);

	return new Response(JSON.stringify({ message: "test transaction made: OK" }), {
		headers: {
			"Content-Type": "application/json",
		},
	});
};
