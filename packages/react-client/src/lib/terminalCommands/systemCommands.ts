// import { audioStore } from "../../stores/audio.store";
// import { handleHelp, helpStore } from "../../stores/help.store";
import {
	addTerminalContent,
	clearTerminalContent,
} from "@lib/stores/terminal.store";
// import { WindowType, windowsStore } from "../lib/stores/windows.store";
import { commandHandler } from "./commandHandler";
import { ORUG_CONFIG } from "@lib/config";

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
		// if (ctx.args[0] === "help") {
		// 	helpStore.hide();
		// 	addTerminalContent({
		// 		text: "Toggled help window",
		// 		format: "hash",
		// 		useTypewriter: true,
		// 	});
		// 	return;
		// }
		commandHandler(ctx.command, true);
	},
	debug: () => {
		// windowsStore.toggle(WindowType.DEBUG);
		// addTerminalContent({
		// 	text: `Debug window ${windowsStore.get(WindowType.DEBUG) ? "enabled" : "disabled"}`,
		// 	format: "out",
		// 	useTypewriter: false,
		// });
	},
	help: ({ command }) => {
		// handleHelp(command);
		// console.log(command);
		// addTerminalContent({
		// 	text: "Toggled help window",
		// 	format: "hash",
		// 	useTypewriter: true,
		// });
	},
	hear: ({ args }) => {
		// if (args.length === 0 || args[0] === "help") {
		// 	helpStore.showHelp("hear");
		// 	return;
		// }
		// {
		// 	const [target, state] = args;
		// 	if (target === "wind") {
		// 		console.log("-----------> wind off");
		// 		audioStore.toggleWind();
		// 		addTerminalContent({
		// 			text: state === "off" ? "Wind sound disabled" : "Wind sound enabled",
		// 			format: "out",
		// 			useTypewriter: false,
		// 		});
		// 	} else if (target === "tone") {
		// 		console.log("-----------> tone off");
		// 		audioStore.toggleTone();
		// 		addTerminalContent({
		// 			text: state === "off" ? "Tonal sound disabled" : "Tonal sound enabled",
		// 			format: "out",
		// 			useTypewriter: false,
		// 		});
		// 	} else if (target === "cricket") {
		// 		console.log("-----------> cricket off");
		// 		audioStore.toggleCricket();
		// 		addTerminalContent({
		// 			text: state === "off" ? "Cricket sound disabled" : "Cricket sound enabled",
		// 			format: "out",
		// 			useTypewriter: false,
		// 		});
		// 	}
		// }
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
	object: async () => {
		const randomId = () => Math.round(Math.random() * 1000000);
		const rnd = (min: number, max: number) =>
			Math.floor(Math.random() * (max - min + 1) + min);
		try {
			const items = [
				[randomId(), rnd(1, 6), rnd(1, 6), rnd(1, 6), rnd(1, 6), [], 0],
				[randomId(), rnd(1, 6), rnd(1, 6), rnd(1, 6), rnd(1, 6), [], 0],
				[randomId(), rnd(1, 6), rnd(1, 6), rnd(1, 6), rnd(1, 6), [], 0],
			];

			const formData = new FormData();
			formData.append("route", "sendDesignerCall");
			formData.append(
				"command",
				JSON.stringify({ call: "create_objects", args: items }),
			);

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
	},
	connection: async () => {
		const dest = {
			endpoints: ORUG_CONFIG.endpoints,
			mode: import.meta.env.MODE,
		};
		addTerminalContent({
			text: JSON.stringify(dest, null, 2),
			format: "system",
			useTypewriter: true,
		});
	},
};
