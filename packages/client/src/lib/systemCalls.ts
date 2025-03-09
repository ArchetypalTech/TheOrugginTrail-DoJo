import { CallData, byteArray, type RawArgsArray } from "starknet";
import { ORUG_CONFIG } from "./config";
import { escapeRegExp, toCairoArray } from "./utils";

async function sendMessage(message: string) {
	const cmds_raw = message.split(/\s+/);
	const cmds = cmds_raw.filter((word) => word !== "");
	const cmd_array = cmds.map((cmd) => byteArray.byteArrayFromString(cmd));

	// connect the account to the contract
	const {
		contracts: { entity },
	} = ORUG_CONFIG;
	// create message as readable contract data
	const calldata = CallData.compile([cmd_array, 23]);
	console.log("sendMessage(cmds): ", cmds, " -> calldata ->", calldata);

	// ionvoke the contract as we are doing a write
	const response = await entity.invoke("listen", [calldata]);

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
	const { call, args } = JSON.parse(props) as DesignerCallProps;
	try {
		// reformat args to cairo array
		if (call !== "create_txt") {
			const data = toCairoArray(args) as RawArgsArray;
			const calldata = CallData.compile(data);
			// console.log(
			// 	`sendDesignerCall[${call}](args):`,
			// 	args,
			// 	" -> calldata ->",
			// 	calldata,
			// );
			const response = await ORUG_CONFIG.contracts.designer.invoke(call, calldata);
			// we do a manual wait because the waitForTransaction is super slow
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
		// console.log("LENGTH >>>>", (args[2] as string).length, args[2]);

		const safeEncoded = encodeURI(args[2] as string);
		const convertedString = byteArray.byteArrayFromString(safeEncoded);

		const data = [args[0], args[1], convertedString] as RawArgsArray;
		const calldata = CallData.compile(data);
		// console.log(
		// 	`sendDesignerCall[${call}](args):`,
		// 	args,
		// 	" -> calldata ->",
		// 	data,
		// );
		const response = await ORUG_CONFIG.contracts.designer.invoke(call, calldata);
		// we do a manual wait because the waitForTransaction is super slow
		await new Promise((r) => setTimeout(r, 500));
		// await ORUG_CONFIG.katanaProvider.waitForTransaction(
		// 	response.transaction_hash,
		// );

		return new Response(JSON.stringify(response), {
			headers: {
				"Content-Type": "application/json",
			},
			status: 200,
		});
	} catch (error) {
		throw new Error(
			`[${(error as Error).message}] @ sendDesignerCall[${call}](args): ${JSON.stringify(args)} `,
		);
	}
}

export const SystemCalls = {
	sendMessage,
	sendDesignerCall,
};
