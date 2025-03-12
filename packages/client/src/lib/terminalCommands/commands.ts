import {
	addTerminalContent,
	clearTerminalContent,
} from "@lib/stores/terminal.store";
import { commandHandler } from "./commandHandler";
import { ZORG_CONFIG } from "@lib/config";
import WalletStore from "../stores/wallet.store";
import { HELP_TEXTS } from "@/data/help.data";

/**
 * Context object passed to each terminal command handler
 * @typedef {Object} CommandContext
 * @property {string} command - The full command string as entered by the user
 * @property {string} cmd - The primary command name (first word of the command)
 * @property {string[]} args - Array of arguments passed to the command
 */
type commandContext = {
	command: string;
	cmd: string;
	args: string[];
};

/**
 * @typedef {Object} TerminalContent
 * @property {string} text - The text content to display in the terminal
 * @property {string} format - Formatting style ('system', 'hash', etc.)
 * @property {boolean} useTypewriter - Whether to use typewriter effect for display
 */

/**
 * ### Terminal System Commands Registry
 *
 * This object contains Client only terminal commands that can be executed in the
 * ZORG game interface. Each key represents a command name that users can type,
 * and the value is a function that handles that command.
 *
 * @example
 * // Adding a new command:
 * // 1. Add your command to this object with a handler function
 * TERMINAL_SYSTEM_COMMANDS["mycommand"] = (ctx) => {
 * 	 yourNewCommand: (ctx)
 *   // 2. Access command information from the context
 *   const { command, cmd, args } = ctx;
 *
 *   // 3. Add terminal output
 *   addTerminalContent({
 *     text: `You executed ${cmd} with arguments: ${args.join(", ")}`,
 *     format: "system", // Use 'system' for informational messages, 'hash' for important data
 *     useTypewriter: true, // Enable typewriter effect for text rendering
 *   });
 *
 *   // 4. Perform any other logic needed for your command
 *   // - Access wallet with WalletStore()
 *   // - Forward to contract commands with commandHandler(command, bypass)
 *   // - Clear terminal with clearTerminalContent()
 * };
 */
export const TERMINAL_SYSTEM_COMMANDS: {
	[key: string]: (command: commandContext) => void;
} = {
	_intro: () => {
		addTerminalContent({
			text: `
			Welcome to the Oruggin Trail, a text adventure game.
			You are a young adventurer, seeking to find the Oruggin Trail, a mysterious and dangerous path.
			`,
			format: "system",
			useTypewriter: true,
		});
	},
	clear: () => {
		clearTerminalContent();
	},
	wallet: async () => {
		if (WalletStore().isConnected) {
			await WalletStore().disconnectController();
			addTerminalContent({
				text: "Disconnected",
				format: "hash",
				useTypewriter: true,
			});
			return;
		}
		const res = await WalletStore().connectController();
		console.log(res);
		if (WalletStore().isConnected) {
			const { username, walletAddress } = WalletStore();
			addTerminalContent({
				text: JSON.stringify({ username, walletAddress }, null, 2),
				format: "hash",
				useTypewriter: true,
			});
		}
	},
	bypass: ({ command }) => {
		// DEMO for commands that need to intercept the msd stream, and then call the contract
		commandHandler(command, true);
	},
	help: () => {
		// Handle help command
		addTerminalContent({
			text: `Available commands:\n\n${Object.entries(HELP_TEXTS)
				.map(([cmd, content]) => `> ${cmd.padEnd(10)}\n${content.description}`)
				.join("\n\n")}`,
			format: "hash",
			useTypewriter: true,
		});
	},
	connection: async () => {
		const dest = {
			endpoints: ZORG_CONFIG.endpoints,
			mode: import.meta.env.MODE,
		};
		addTerminalContent({
			text: JSON.stringify(dest, null, 2),
			format: "system",
			useTypewriter: true,
		});
	},
};
