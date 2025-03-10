import { CallData, byteArray, type RawArgsArray } from "starknet";
import { ORUG_CONFIG } from "@lib/config";
import { toCairoArray } from "@lib/utils";

async function formatCallData(message: string) {
	const cmds_raw = message.split(/\s+/);
	const cmds = cmds_raw.filter((word) => word !== "");
	const cmd_array = cmds.map((cmd) => byteArray.byteArrayFromString(cmd));
	// create message as readable contract data
	const calldata = CallData.compile([cmd_array, 23]);
	console.log("formatCallData(cmds): ", cmds, " -> calldata ->", calldata);
	return { calldata, cmds };
}

/*
 * sendMessage
 * Serverside call for player commands
 */
async function sendMessage(message: string) {
	const {
		contracts: { entity },
	} = ORUG_CONFIG;
	// create message as readable contract data
	const { calldata, cmds } = await formatCallData(message);
	try {
		// ionvoke the contract as we are doing a write
		const response = await entity.invoke("listen", [calldata]);
		return new Response(
			JSON.stringify({ tx: response.transaction_hash, cmds, calldata }),
			{
				headers: {
					"Content-Type": "application/text",
				},
			},
		);
	} catch (error) {
		console.error("sendMessage(cmds): ", cmds, " -> error ->", error);
		return new Response(JSON.stringify({ message: (error as Error).message }), {
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
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

/*
 * sendDesignerCall
 * Serverside call for designer commands
 */

async function sendDesignerCall(props: string) {
	const { call, args } = JSON.parse(props) as DesignerCallProps;
	try {
		// other calls follow the same format Array<Object> see Cairo Models
		if (call !== "create_txt") {
			// reformat args to cairo array
			const data = toCairoArray(args) as RawArgsArray;
			const calldata = CallData.compile(data);
			const response = await ORUG_CONFIG.contracts.designer.invoke(call, calldata);
			// we do a manual wait because the waitForTransaction is super slow
			await new Promise((r) => setTimeout(r, 500));
			return new Response(JSON.stringify(response), {
				headers: {
					"Content-Type": "application/json",
				},
			});
		}

		const safeEncoded = encodeURI(args[2] as string);
		const convertedString = byteArray.byteArrayFromString(safeEncoded);

		const data = [args[0], args[1], convertedString] as RawArgsArray;
		const calldata = CallData.compile(data);

		const response = await ORUG_CONFIG.contracts.designer.invoke(call, calldata);
		// we do a manual wait because the waitForTransaction is super slow
		await new Promise((r) => setTimeout(r, 500));

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
	formatCallData,
};
