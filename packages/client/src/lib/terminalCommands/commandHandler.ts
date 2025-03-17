import { addTerminalContent } from "@lib/stores/terminal.store";
import { TERMINAL_SYSTEM_COMMANDS } from "../../data/command.data";
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
export const sendCommand = async <
	T extends keyof typeof TERMINAL_SYSTEM_COMMANDS,
>(
	_command: T,
	bypassSystem = false,
) => {
	const command = _command.toString().trim().toLowerCase();
	const [cmd, ...args] = command.split(/\s+/);

	const context = {
		command,
		cmd: cmd.trim().toLowerCase(),
		args: args.map((arg) => arg.trim().toLowerCase()),
	};

	console.log("[sendCommand]:", context, context.cmd[0]);

	// Hide _ commands
	if (context.cmd[0] !== "_") {
		addTerminalContent({
			text: `\n> ${command}`,
			format: "input",
			useTypewriter: false,
		});
	}

	// try to get a lowercasematch with systemCommands
	const systemCmd = Object.keys(TERMINAL_SYSTEM_COMMANDS).find(
		(key) => key.toLowerCase() === cmd,
	);
	if (!bypassSystem && systemCmd) {
		TERMINAL_SYSTEM_COMMANDS[systemCmd](context);
		return;
	}

	// skip token gating in DEV
	if (!import.meta.env.DEV) {
		// check if player is allowed to interact (tokengating) {}
		if (!WalletStore().isConnected) {
			sendCommand("_connect_wallet");
			return;
		}
		if (!hasRequiredTokens()) return;
	}

	try {
		return await SystemCalls.execCommand(command);
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
	if (!ZORG_CONFIG.useController) return true;
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
