import { CallData, byteArray, type RawArgsArray } from "starknet";
import { ZORG_CONFIG } from "@lib/config";
import { toCairoArray } from "../editor/utils";
import { addTerminalContent } from "./stores/terminal.store";
import WalletStore from "./stores/wallet.store";

/**
 * Sends a command to the entity contract.
 * Clientside call for player commands.
 *
 * @param {string} command - The command to send
 * @returns {Promise<void>}
 */
async function sendCommand(command: string): Promise<void> {
	try {
		const formData = new FormData();
		formData.append("command", command);
		formData.append("route", "sendMessage");

		console.log("[KATANA-DEV] sendControllerCommand", command);
		const { calldata } = await formatCallData(command);
		await ZORG_CONFIG.contracts.entity.invoke("listen", [calldata]);
	} catch (error) {
		console.error("Error sending command:", error as Error);
	}
}

/**
 * Sends a command through the controller.
 * Clientside call for controller commands.
 *
 * @param {string} command - The command to send
 * @returns {Promise<void>}
 */
async function sendControllerCommand(command: string): Promise<void> {
	if (!WalletStore().isConnected) {
		addTerminalContent({
			text: "You are not yet connected",
			format: "hash",
			useTypewriter: true,
		});
		return;
	}
	console.log("[CONTROLLER] sendControllerCommand", command);
	console.time("calltime");
	const { calldata } = await formatCallData(command);
	WalletStore().controller?.account?.execute([
		{
			contractAddress: ZORG_CONFIG.contracts.entity.address,
			entrypoint: "listen",
			calldata,
		},
	]);
	console.timeEnd("calltime");
}

/**
 * Formats a command message into calldata for contract invocation.
 * Splits the message into an array of commands and converts them to byte arrays.
 *
 * @param {string} message - The message to format
 * @returns {Promise<{calldata: RawArgsArray, cmds: string[]}>} The formatted calldata and command array
 */
async function formatCallData(message: string) {
	const cmds_raw = message.split(/\s+/);
	const cmds = cmds_raw.filter((word) => word !== "");
	const cmd_array = cmds.map((cmd) => byteArray.byteArrayFromString(cmd));
	// create message as readable contract data
	const calldata = CallData.compile([cmd_array, 23]);
	console.log("formatCallData(cmds): ", cmds, " -> calldata ->", calldata);
	return { calldata, cmds };
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

/**
 * Sends a call to the designer contract.
 * Handles different types of calls with appropriate data formatting.
 *
 * @param {string} props - JSON string containing the call and args properties
 * @returns {Promise<Response>} The response from the contract call
 * @throws {Error} If the contract call fails
 */
async function sendDesignerCall(props: DesignerCallProps) {
	const { call, args } = props;
	console.log(call, args);
	try {
		// other calls follow the same format Array<Object> see Cairo Models
		if (call !== "create_txt") {
			// reformat args to cairo array
			const data = toCairoArray(args) as RawArgsArray;
			const calldata = CallData.compile(data);
			const response = await ZORG_CONFIG.contracts.designer.invoke(call, calldata);
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

		const response = await ZORG_CONFIG.contracts.designer.invoke(call, calldata);
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

/**
 * SystemCalls object that exports all the functions for external use.
 *
 * @namespace
 * @property {Function} sendDesignerCall - Function to send calls to the designer contract
 * @property {Function} sendCommand - Function to send commands to the entity contract
 * @property {Function} sendControllerCommand - Function to send commands through the controller
 */
export const SystemCalls = {
	sendDesignerCall,
	sendCommand,
	sendControllerCommand,
};
