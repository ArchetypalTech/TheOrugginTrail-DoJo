import { exec } from "child_process";
import type { RequestHandler } from "./$types";
import { systemCalls } from "$lib";
import fs from "fs";
import { setFilePath } from "$lib";
import {
	RpcProvider,
	Account,
	json,
	Contract,
	CallData,
	byteArray,
} from "starknet";
import manifest from "@zorg/contracts/manifest_dev.json";
import { Katana, Manifest_Addresses } from "../../be_fe_constants";

// wallet 10
// NB `sozo` uses wallet 0 as the migration account this
// aacoutn will fail if we use it as the account for the
// contract invoke calls
//| Account address |  0x6b86e40118f29ebe393a75469b4d926c7a44c2e2681b6d319520b7c1156d114
//| Private key     |  0x1c9053c053edf324aec366a34c6901b1095b07af69495bffec7d7fe21effb1b
//| Public key      |  0x4c339f18b9d1b95b64a6d378abd1480b2e0d5d5bd33cd0828cbce4d65c27284

// toggle to pass command to Torri client
const MANIFEST = setFilePath("../manifest/system_outputter.json");

// POST on route /api
export const POST: RequestHandler = async (event) => {
	console.log("===", event.request.url);
	const data = await event.request.formData();
	const command = data.get("entry") as string;
	// log recieving POST
	console.log("Send message to katana", command);
	return systemCalls.sendMessage(command);
};

/**
 * make get request from client
 * TODO -- deprecate as we arent using this right now
 * kept in here for unknown fear mainly
 * */
export const GET: RequestHandler = async () => {
	console.log("----------------> GET");

	// set up the provider and account. Writes are not free
	const katanaProvider: RpcProvider = new RpcProvider({
		nodeUrl: Katana.KATANA_ENDPOINT,
	});
	const burnerAccount: Account = new Account(
		katanaProvider,
		Katana.addr,
		Katana.pKey,
	);

	// read in the compiled contract abi
	const contractAbi = manifest.contracts.find(
		(x) => x.tag === "the_oruggin_trail-meatpuppet",
	)!;
	// json.parse(
	//     fs.readFileSync(MANIFEST()).toString('ascii')
	// );

	const contractAddr: string =
		"0x5351273085d5dfbf7ab213b6712cd0cd81b12eefcfa278b8f2791e9061af146";

	const theOutputter: Contract = new Contract(
		contractAbi.abi,
		Manifest_Addresses.OUTPUTTER_ADDRESS,
		katanaProvider,
	);

	// connect the account to the contract
	theOutputter.connect(burnerAccount);

	// call it baby
	const calldata = CallData.compile([byteArray.byteArrayFromString("foobar")]);

	// const res2 = await theOutputter.updateOutput(calldata)
	//console.log("+++++++++++++++++++++++++++++++++")
	//console.log(res2, calldata)
	//console.log("+++++++++++++++++++++++++++++++++")
	let response = await theOutputter.invoke("updateOutput", [calldata]);
	// console.log(`-----> res: ${res2}`)

	// pray for rain
	// await katanaProvider.waitForTransaction(res2.transaction_hash);
	await katanaProvider.waitForTransaction(response.transaction_hash);
	console.log("==================================");
	console.log(response.transaction_hash);

	return new Response(
		JSON.stringify({ message: "test transaction made: OK" }),
		{
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
};

const SHELL_COMMAND = "echo 'hello worlz'";
function executeShellScript() {
	const RESPONSE = new Response(
		JSON.stringify({ success: true, value: action }),
		{
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
	// example to show you can execute server side code here
	return new Promise((resolve, reject) => {
		exec(SHELL_COMMAND, (error, stdout, stderr) => {
			if (error) console.warn(error);
			if (stdout) resolve(RESPONSE);
			reject(stderr);
		});
	});
}
