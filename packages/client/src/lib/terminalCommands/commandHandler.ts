import { addTerminalContent } from "@lib/stores/terminal.store";
// import { getBalance2 } from "../tokens/interaction";
import { TERMINAL_SYSTEM_COMMANDS } from "./commands";
import { SystemCalls } from "@lib/systemCalls";
import { ZORG_CONFIG } from "@lib/config";
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
	// Hide _ commands
	if (command[0] !== "_") {
		addTerminalContent({
			text: `\n> ${command}`,
			format: "input",
			useTypewriter: false,
		});
	}

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
				text: "type [wallet] to connect.",
				format: "hash",
				useTypewriter: true,
			});
			return;
		}
		if (!hasRequiredTokens()) return;
	}

	try {
		if (ZORG_CONFIG.useSlot) {
			return await SystemCalls.sendControllerCommand(command);
		}
		return await SystemCalls.sendCommand(command);
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
	// we don't check if not using controller
	if (!ZORG_CONFIG.useSlot) return true;
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
