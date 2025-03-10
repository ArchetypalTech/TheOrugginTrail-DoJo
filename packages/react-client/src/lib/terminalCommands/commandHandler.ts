import { addTerminalContent } from "@lib/stores/terminal.store";
// import { getBalance2 } from "../tokens/interaction";
import { TERMINAL_SYSTEM_COMMANDS } from "./systemCommands";
// import { walletStore } from "@lib/stores/wallet.store";
import { SystemCalls } from "@lib/systemCalls";
import { ORUG_CONFIG } from "@lib/config";
import WalletStore from "@lib/stores/wallet.store";

export const commandHandler = async (command: string, bypassSystem = false) => {
	const [cmd, ...args] = command.trim().toLowerCase().split(/\s+/);
	addTerminalContent({
		text: `\n> ${command}`,
		format: "input",
		useTypewriter: false,
	});

	const context = {
		command: command.trim().toLowerCase(),
		cmd: cmd.trim().toLowerCase(),
		args: args.map((arg) => arg.trim().toLowerCase()),
	};

	// try to get a match with systemCommands
	console.log(context);
	if (!bypassSystem && TERMINAL_SYSTEM_COMMANDS[cmd]) {
		console.log("MATCH");
		TERMINAL_SYSTEM_COMMANDS[cmd](context);
		return;
	}

	// skip token gating in DEV
	if (!import.meta.env.DEV) {
		// check if player is allowed to interact (tokengating) {}
		if (!WalletStore().isConnected) {
			addTerminalContent({
				text: "Connect",
				format: "hash",
				useTypewriter: true,
			});
			return;
		}
		// const tokenBalance = await getBalance2();
		// if (tokenBalance < 1) {
		// 	addTerminalContent({
		// 		text: `You have ${tokenBalance} TOT Tokens and cannot proceed on the journey.`,
		// 		format: "error",
		// 		useTypewriter: true,
		// 	});
		// }
	}

	// forward to contract
	try {
		const response = await sendCommand(command);
	} catch (error) {
		console.error("Error sending command:", error);
	}
};

/*
 * sendCommand
 * Clientside call for player commands
 */

async function sendCommand(command: string): Promise<string> {
	if (WalletStore().isConnected) {
		// we're connected to controller
		return sendControllerCommand(command);
	}
	try {
		const formData = new FormData();
		formData.append("command", command);
		formData.append("route", "sendMessage");

		// call the /api endpoint to post a command
		const response = await fetch("/api", {
			method: "POST",
			body: formData,
		});
		return response.json();
	} catch (error) {
		const e = error as Error;
		return e.message;
	}
}

/*
 * sendControllerCommand
 * Clientside call for controller commands
 */

async function sendControllerCommand(command: string): Promise<string> {
	console.log("[CONTROLLER] sendControllerCommand", command);
	console.time("calltime");
	const { calldata, cmds } = await SystemCalls.formatCallData(command);
	WalletStore().controller?.account?.execute([
		{
			contractAddress: ORUG_CONFIG.contracts.entity.address,
			entrypoint: "listen",
			calldata,
		},
	]);
	console.timeEnd("calltime");
	return "woop";
}
