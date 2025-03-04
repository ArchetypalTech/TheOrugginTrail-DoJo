import type { InitDojo } from "$lib/dojo";
import { writable } from "svelte/store";
import { addTerminalContent } from "$lib/stores/terminal_store";

export type Outputter = {
	playerId: string;
	text_o_vision: string;
};

let lastProcessedText = "";
let trimmedNewText = "";
let timeout = Date.now();

export const Dojo_PlayerId = writable<number>(23);
export const Dojo_Outputter = writable<Outputter>(undefined);
export const Dojo_Config =
	writable<Awaited<ReturnType<typeof InitDojo>>>(undefined);

// FIXME: bit of an ugly hack to track whether we have a subscription persisting through HMR.
let existingSubscription: unknown | undefined = undefined;

Dojo_Config.subscribe(async (config) => {
	if (config !== undefined) {
		console.log("[DOJO]: CONFIG ", config);
		if (existingSubscription === undefined) {
			const [initialEntities, subscription] = await config.sub(23, (response) => {
				if (response.error) {
					console.error("Error setting up entity sync:", response.error);
				} else if (response.data) {
					if (response.data[0].models?.the_oruggin_trail?.Output !== undefined) {
						Dojo_Outputter.set(
							response.data[0].models.the_oruggin_trail.Output as Outputter,
						);
						return;
					}
				}
				console.log("[DOJO]: initial response", response);
			});
			console.log("[DOJO]: initialized");
			existingSubscription = subscription;
		}
	}
});

Dojo_Outputter.subscribe(async (output) => {
	// console.log("DOJO OUTPUT: ", output);
	if (output === undefined) {
		return;
	}
	const newText = Array.isArray(output.text_o_vision)
		? output.text_o_vision.join("\n")
		: output.text_o_vision || ""; // Ensure it's always a string

	console.log("OUT: ", newText);

	trimmedNewText = newText.trim();

	if (
		trimmedNewText === lastProcessedText.trim() &&
		Date.now() - timeout < 500
	) {
		console.log("Skipping duplicate update");
		timeout = Date.now();
	} else {
		timeout = Date.now();
		const lines: string[] = processWhitespaceTags(trimmedNewText);
		lastProcessedText = trimmedNewText;
		for (const line of lines) {
			// console.log("LINE: ", line);
			addTerminalContent({
				text: line,
				format: "out",
				useTypewriter: true,
			});
		}
	}
});

function processWhitespaceTags(input: string): string[] {
	const tagRegex = /\\([nrt])/g;
	const replacements: { [key: string]: string } = {
		n: "\n",
		r: "\r",
		t: "\t",
	};

	const processedString = input.replace(
		tagRegex,
		(match, p1) => replacements[p1] || match,
	);
	return processedString.split("\n");
}
