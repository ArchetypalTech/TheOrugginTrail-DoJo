import {
	addTerminalContent,
	clearTerminalContent,
} from "@lib/stores/terminal.store";
import { sendCommand } from "@lib/terminalCommands/commandHandler";
import { ZORG_CONFIG } from "@lib/config";
import WalletStore from "../lib/stores/wallet.store";
import { HELP_TEXTS } from "@/data/help.data";
import { APP_DATA } from "@/data/app.data";
import DojoStore from "@/lib/stores/dojo.store";

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
 * @important Commands NOT case sensitive
 * @important Commands prefixed with _ are reserved (do not show as command)
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
 *   // - Forward to contract commands with sendCommand(command, bypass)
 *   // - Clear terminal with clearTerminalContent()
 * };
 */
export const TERMINAL_SYSTEM_COMMANDS: {
	[key: string]: (command: commandContext) => void;
} = {
	_bootLoader: () => {
		sendCommand("_intro");
		if (ZORG_CONFIG.useController) {
			if (!WalletStore().isConnected) {
				sendCommand("_connect_wallet");
			} else {
				sendCommand("_welcome_back");
			}
		}

		sendCommand("_hint");

		DojoStore().setStatus({
			status: "inputEnabled",
			error: null,
		});
	},
	_intro: () => {
		addTerminalContent({
			text: APP_DATA.intro,
			format: "system",
			useTypewriter: true,
			speed: 4,
			style: { textAlign: "center" },
		});
	},
	_hint: () => {
		addTerminalContent({
			text: 'type [command] [target], or type "help"',
			format: "input",
			useTypewriter: true,
		});
	},
	_connect_wallet: () => {
		addTerminalContent({
			text: "type [connect] to connect",
			format: "hash",
			useTypewriter: true,
		});
	},
	_not_yet_connected: () => {
		addTerminalContent({
			text: "not connected, use [connect] to connect",
			format: "hash",
			useTypewriter: true,
		});
	},
	_welcome_back: () => {
		addTerminalContent({
			text: `welcome back ${WalletStore().username}`,
			format: "hash",
			useTypewriter: true,
		});
	},
	_fatal_error: () => {
		addTerminalContent({
			text: `FATAL+ERROR: ${WalletStore().username}`,
			format: "error",
			useTypewriter: true,
		});
	},
	clear: () => {
		clearTerminalContent();
	},
	connect: async () => {
		if (WalletStore().isConnected) {
			addTerminalContent({
				text: "already connected, use [disconnect] to disconnect",
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
				text: `Connected:\n${JSON.stringify({ username, walletAddress }, null, 2)}`,
				format: "hash",
				useTypewriter: true,
			});
		}
	},
	disconnect: async () => {
		if (!WalletStore().isConnected) {
			addTerminalContent({
				text: "not connected, use [connect] to connect",
				format: "hash",
				useTypewriter: true,
			});
			return;
		}
		await WalletStore().disconnectController();
		addTerminalContent({
			text: "disconnected",
			format: "hash",
			useTypewriter: true,
		});
		return;
	},
	_bypass: ({ command }) => {
		// DEMO for commands that need to intercept the msd stream, and then call the contract
		sendCommand(command, true);
	},
	help: () => {
		// Handle help command
		addTerminalContent({
			text: `available commands:\n\n${Object.entries(HELP_TEXTS)
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
} as const;
