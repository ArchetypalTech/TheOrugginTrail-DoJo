import { addTerminalContent } from "@lib/stores/terminal.store";
// import { getBalance2 } from "../tokens/interaction";
import { TERMINAL_SYSTEM_COMMANDS } from "./commands";
import { SystemCalls } from "@lib/systemCalls";
import { ORUG_CONFIG } from "@lib/config";
import WalletStore from "@lib/stores/wallet.store";

/**
 * Handles terminal commands entered by the user
 *
 * @param {string} command - The full command string entered by the user
 * @param {boolean} bypassSystem - When true, bypasses system commands and sends directly to contract
 * @returns {Promise<void>}
 */
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
	console.log("[commandHandler]:", context);
	if (!bypassSystem && TERMINAL_SYSTEM_COMMANDS[cmd]) {
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
		if (!hasRequiredTokens()) return;
	}

	try {
		if (ORUG_CONFIG.useSlot) {
			return await sendControllerCommand(command);
		}
		return await sendCommand(command);
	} catch (error) {
		console.error("Error sending command:", error);
	}
};

/**
 * Checks if the user has the required tokens to proceed
 *
 * @returns {Promise<boolean>} True if user has the required tokens, false otherwise
 */
async function hasRequiredTokens(): Promise<boolean> {
	if (!ORUG_CONFIG.useSlot) return true;
	if (!WalletStore().isConnected) {
		return false;
	}
	// FIXME: currently token is always 1
	const tokenBalance = 1; //await getBalance2();
	if (tokenBalance < 1) {
		addTerminalContent({
			text: `You have ${tokenBalance} TOT Tokens and cannot proceed on the journey.`,
			format: "error",
			useTypewriter: true,
		});
	}
	return true;
}

/**
 * Sends a command to the entity contract
 * Clientside call for player commands
 *
 * @param {string} command - The command to send
 * @returns {Promise<void>}
 */
async function sendCommand(command: string): Promise<void> {
	try {
		const formData = new FormData();
		formData.append("command", command);
		formData.append("route", "sendMessage");

		const { calldata } = await SystemCalls.formatCallData(command);
		await ORUG_CONFIG.contracts.entity.invoke("listen", [calldata]);
	} catch (error) {
		console.error("Error sending command:", error as Error);
	}
}

/**
 * Sends a command through the controller
 * Clientside call for controller commands
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
	const { calldata } = await SystemCalls.formatCallData(command);
	WalletStore().controller?.account?.execute([
		{
			contractAddress: ORUG_CONFIG.contracts.entity.address,
			entrypoint: "listen",
			calldata,
		},
	]);
	console.timeEnd("calltime");
}
