import { addTerminalContent } from "$lib/stores/terminal_store";
import { connectedToArX, connectedToCGC } from "$lib/stores/wallet_store";
import { getBalance2 } from "$lib/tokens/interaction";
import { get } from "svelte/store";
import { TERMINAL_SYSTEM_COMMANDS } from "./systemCommands";

export const commandHandler = async (command: string, bypassSystem = false) => {
	const [cmd, ...args] = command.trim().toLowerCase().split(/\s+/);
	addTerminalContent({
		text: command,
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
		if (!get(connectedToArX) && !get(connectedToCGC)) {
			addTerminalContent({
				text: "You are not in the realm of shoggoth yet...",
				format: "shog",
				useTypewriter: true,
			});
			return;
		}
		const tokenBalance = await getBalance2();
		if (tokenBalance < 1) {
			addTerminalContent({
				text: `You have ${tokenBalance} TOT Tokens and cannot proceed on the journey.`,
				format: "error",
				useTypewriter: true,
			});
		}
	}

	// forward to contract
	try {
		const response = await sendCommand(command);
	} catch (error) {
		console.error("Error sending command:", error);
	}
};

async function sendCommand(command: string): Promise<string> {
	try {
		const formData = new FormData();
		formData.append("entry", command);

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
