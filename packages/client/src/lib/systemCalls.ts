import { CallData, byteArray, getCalldata, type RawArgsArray } from "starknet";
import { ORUG_CONFIG } from "./config";
import { toCairoArray } from "./utils";

async function sendMessage(message: string) {
	const cmds_raw = message.split(/\s+/);
	const cmds = cmds_raw.filter((word) => word !== "");
	const cmd_array = cmds.map((cmd) => byteArray.byteArrayFromString(cmd));

	// connect the account to the contract
	const {
		contracts: { outputter },
	} = ORUG_CONFIG;
	// create message as readable contract data
	const calldata = CallData.compile([cmd_array, 23]);
	console.log("sendMessage(cmds): ", cmds, " -> calldata ->", calldata);

	// ionvoke the contract as we are doing a write
	const response = await outputter.invoke("listen", [calldata]);

	return new Response(JSON.stringify(response), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}

export type DesignerCall =
	| "create_objects"
	| "create_actions"
	| "create_rooms"
	| "create_txt";

type DesignerCallProps = {
	call: DesignerCall;
	args: unknown[];
};

async function sendDesignerCall(props: string) {
	try {
		const { call, args } = JSON.parse(props) as DesignerCallProps;
		// reformat args to cairo array
		if (call !== "create_txt") {
			const data = toCairoArray(args) as RawArgsArray;
			const calldata = CallData.compile(data);
			console.log(
				`sendDesignerCall[${call}](args):`,
				args,
				" -> calldata ->",
				calldata,
			);
			const response = await ORUG_CONFIG.contracts.designer.invoke(call, calldata);
			await new Promise((r) => setTimeout(r, 500));
			// await ORUG_CONFIG.katanaProvider.waitForTransaction(
			// 	response.transaction_hash,
			// );
			return new Response(JSON.stringify(response), {
				headers: {
					"Content-Type": "application/json",
				},
			});
		}
		// txt format: id: felt252, ownedBy: felt252, val: ByteArray
		// 2nd arg needs to always be 0
		console.log("LENGTH >>>>", (args[2] as string).length);
		// console.log(args[2]);
		// if (args[2].length > 16) {
		args[2] = (args[2] as string).substring(0, 125);
		// 	console.log("trimmed >>>>", args[2]);
		// }
		const data = [
			args[0],
			args[1],
			byteArray.byteArrayFromString(args[2] as string),
		] as RawArgsArray;
		const calldata = CallData.compile(data);
		console.log(
			`sendDesignerCall[${call}](args):`,
			args,
			" -> calldata ->",
			calldata,
		);
		const response = await ORUG_CONFIG.contracts.designer.invoke(call, calldata);
		await new Promise((r) => setTimeout(r, 500));
		// await ORUG_CONFIG.katanaProvider.waitForTransaction(
		// 	response.transaction_hash,
		// );
		return new Response(JSON.stringify(response), {
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error creating object:", error);
		return new Response(
			JSON.stringify({ error: `Error creating object: ${error.message}` }),
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
}

export const SystemCalls = {
	sendMessage,
	sendDesignerCall,
};
