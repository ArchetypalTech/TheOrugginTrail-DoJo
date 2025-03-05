import { CallData, byteArray } from "starknet";
import { ORUG_CONFIG } from "./config";

async function sendMessage(message: string) {
	const cmds_raw = message.split(/\s+/);
	const cmds = cmds_raw.filter((word) => word !== "");
	const cmd_array = cmds.map((cmd) => byteArray.byteArrayFromString(cmd));

	// connect the account to the contract
	const { theOutputter } = ORUG_CONFIG;
	// create message as readable contract data
	const calldata = CallData.compile([cmd_array, 23]);
	console.log("sendMessage(cmds): ", cmds, "(calldata): ", calldata);

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
