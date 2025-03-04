import { audioStore } from "$lib/stores/audio_store";
import { handleHelp, helpStore } from "$lib/stores/help_store";
import {
	addTerminalContent,
	clearTerminalContent,
} from "$lib/stores/terminal_store";
import { WindowType, windowsStore } from "$lib/stores/windows_store";
import { get } from "svelte/store";
import { commandHandler } from "./commandHandler";

type commandContext = {
	command: string;
	cmd: string;
	args: string[];
};

export const TERMINAL_SYSTEM_COMMANDS: {
	[key: string]: (command: commandContext) => void;
} = {
	clear: () => {
		clearTerminalContent();
	},
	close: (ctx) => {
		if (ctx.args[0] === "help") {
			helpStore.hide();
			addTerminalContent({
				text: "Toggled help window",
				format: "hash",
				useTypewriter: true,
			});
			return;
		}
		commandHandler(ctx.command, true);
	},
	debug: () => {
		windowsStore.toggle(WindowType.DEBUG);
		addTerminalContent({
			text: `Debug window ${windowsStore.get(WindowType.DEBUG) ? "enabled" : "disabled"}`,
			format: "out",
			useTypewriter: false,
		});
	},
	help: ({ command }) => {
		handleHelp(command);
		console.log(command);
		addTerminalContent({
			text: "Toggled help window",
			format: "hash",
			useTypewriter: true,
		});
	},
	hear: ({ args }) => {
		if (args.length === 0 || args[0] === "help") {
			helpStore.showHelp("hear");
			return;
		}
		{
			const [target, state] = args;
			if (target === "wind") {
				console.log("-----------> wind off");
				audioStore.toggleWind();
				addTerminalContent({
					text: state === "off" ? "Wind sound disabled" : "Wind sound enabled",
					format: "out",
					useTypewriter: false,
				});
			} else if (target === "tone") {
				console.log("-----------> tone off");
				audioStore.toggleTone();
				addTerminalContent({
					text: state === "off" ? "Tonal sound disabled" : "Tonal sound enabled",
					format: "out",
					useTypewriter: false,
				});
			} else if (target === "cricket") {
				console.log("-----------> cricket off");
				audioStore.toggleCricket();
				addTerminalContent({
					text: state === "off" ? "Cricket sound disabled" : "Cricket sound enabled",
					format: "out",
					useTypewriter: false,
				});
			}
		}
	},
	"balance-tottokens": (ctx) => TERMINAL_SYSTEM_COMMANDS.getBalance(ctx),
	getBalance: () => {
		addTerminalContent({
			text: "Temporarily unimplemented",
			format: "shog",
			useTypewriter: true,
		});
		console.warn("Temporarily unimplemented 'balance-tottokens' command");
		// if (get(connectedToArX) || get(connectedToCGC)) {
		//   try {
		//     const result = await getBalance(); // Await the Promise here
		//     addTerminalContent({
		//       text: `${result}`,
		//       format: "shog",
		//       useTypewriter: true,
		//     });
		//   } catch (error) {
		//     console.error("Error fetching balance:", error);
		//     addTerminalContent({
		//       text: `Error getting your ticket balance: ${(error as Error).message || "An unknown error occurred."}`,
		//       format: "error",
		//       useTypewriter: true,
		//     });
		//   }
		//   return;
		// }
		// addTerminalContent({
		//   text: "You are not in the realm of shoggoth yet...",
		//   format: "shog",
		//   useTypewriter: true,
		// });
	},
};
