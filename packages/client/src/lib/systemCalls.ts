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
			const response = ORUG_CONFIG.contracts.designer.invoke(call, calldata);
			return new Response(JSON.stringify(response), {
				headers: {
					"Content-Type": "application/json",
				},
			});
		}
		// txt format: id: felt252, ownedBy: felt252, val: ByteArray
		const data = [
			args[0],
			0,
			byteArray.byteArrayFromString(args[1] as string),
		] as RawArgsArray;
		const calldata = CallData.compile(data);
		console.log(
			`sendDesignerCall[${call}](args):`,
			args,
			" -> calldata ->",
			calldata,
		);
		const response = ORUG_CONFIG.contracts.designer.invoke(call, calldata);
		return new Response(JSON.stringify(response), {
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error creating object:", error);
	}
}

export const SystemCalls = {
	sendMessage,
	sendDesignerCall,
};
