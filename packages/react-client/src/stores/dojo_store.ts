import type { InitDojo } from "../lib/dojo";
import { create } from "zustand";
import type { StandardizedQueryResult } from "@dojoengine/sdk";

export type Outputter = {
	playerId: string;
	text_o_vision: string;
};

export type DojoStatus = {
	status: "loading" | "initialized" | "spawning" | "error" | "controller";
	error: string | null;
};

export type FormatType = "input" | "hash" | "error" | "out" | "shog" | "system";
export type TerminalContentItem = {
	text: string;
	format: FormatType;
	useTypewriter?: boolean;
	speed?: number;
	style?: string;
};

// Define schema types to match the expected SDK constraint
interface SchemaModelType {
	[field: string]: any; // Must use 'any' to match the SDK's constraint
}

interface SchemaType {
	[model: string]: SchemaModelType;
}

// Create initial state object
const initialState = {
	// State
	status: {
		status: "loading" as DojoStatus["status"],
		error: null as DojoStatus["error"],
	},
	playerId: 23,
	outputter: undefined as Outputter | undefined,
	config: undefined as Awaited<ReturnType<typeof InitDojo>> | undefined,
	terminalContent: [] as TerminalContentItem[],
	currentContentItem: null as TerminalContentItem | null,
	contentQueue: [] as TerminalContentItem[],

	// Internal state trackers
	lastProcessedText: "",
	trimmedNewText: "",
	timeout: Date.now(),
	existingSubscription: undefined as unknown | undefined,
};

// Derive the state type from the initial state
type DojoState = typeof initialState;

// Define action types separately for better readability
type DojoActions = {
	setStatus: (status: DojoStatus) => void;
	setPlayerId: (id: number) => void;
	setOutputter: (outputter: Outputter | undefined) => void;
	addTerminalContent: (item: TerminalContentItem) => void;
	nextItem: (contentItem: TerminalContentItem | null) => void;
	clearTerminalContent: () => void;
	initializeConfig: (
		config: Awaited<ReturnType<typeof InitDojo>> | undefined,
	) => Promise<void>;
};

// Complete store type
type DojoStore = DojoState & DojoActions;

export const useDojoStore = create<DojoStore>((set, get) => ({
	// Use the initial state object for default values
	...initialState,

	// Actions
	setStatus: (status) => set({ status }),
	setPlayerId: (playerId) => set({ playerId }),
	setOutputter: (outputter) => {
		set({ outputter });

		if (outputter === undefined) {
			return;
		}

		const { lastProcessedText, timeout } = get();
		const newText = Array.isArray(outputter.text_o_vision)
			? outputter.text_o_vision.join("\n")
			: outputter.text_o_vision || ""; // Ensure it's always a string

		console.log("OUT: ", newText);

		const trimmedNewText = decodeURI(newText.trim()).replaceAll("%2C", ",");
		set({ trimmedNewText });

		if (
			trimmedNewText === lastProcessedText.trim() &&
			Date.now() - timeout < 500
		) {
			console.log("Skipping duplicate update");
			set({ timeout: Date.now() });
		} else {
			set({ timeout: Date.now() });
			const lines: string[] = processWhitespaceTags(trimmedNewText);
			set({ lastProcessedText: trimmedNewText });

			for (const line of lines) {
				get().addTerminalContent({
					text: line,
					format: "out",
					useTypewriter: true,
				});
			}
		}
	},
	addTerminalContent: (item) => {
		set((state) => ({
			contentQueue: [...state.contentQueue, item],
		}));

		// Similar to Svelte's tick, we use setTimeout with 0ms to defer execution
		setTimeout(() => {
			if (get().currentContentItem === null) {
				get().nextItem(null);
			}
		}, 0);
	},
	nextItem: (contentItem) => {
		const state = get();

		// Check if contentItem is in the currentItem
		if (contentItem && state.currentContentItem === contentItem) {
			set((state) => ({
				terminalContent: [...state.terminalContent, contentItem],
				currentContentItem: null,
			}));
		}

		if (state.contentQueue.length > 0) {
			const nextItem = state.contentQueue[0];
			if (nextItem) {
				set((state) => ({
					contentQueue: state.contentQueue.filter((item) => item !== nextItem),
					currentContentItem: nextItem,
				}));
			}
		}
	},
	clearTerminalContent: () => set({ terminalContent: [] }),
	initializeConfig: async (config) => {
		set({ config });
		const { existingSubscription, playerId } = get();

		if (config === undefined) return;

		console.log("[DOJO]: CONFIG ", config);

		if (existingSubscription !== undefined) return;

		try {
			const [initialEntities, subscription] = await config.sub(
				playerId,
				(response: {
					data?: StandardizedQueryResult<SchemaType> | undefined;
					error?: Error;
				}) => {
					if (response.error) {
						console.error("Error setting up entity sync:", response.error);
						get().setStatus({
							status: "error",
							error: response.error.message || "SYNC FAILURE",
						});
						return;
					}

					// Safer property access with type checking
					const outputData = response.data?.[0]?.models?.the_oruggin_trail?.Output;
					if (
						outputData &&
						typeof outputData === "object" &&
						"playerId" in outputData &&
						"text_o_vision" in outputData
					) {
						get().setOutputter(outputData as Outputter);
						return;
					}

					console.info(
						"[DOJO]: initial response",
						JSON.stringify(response?.data?.[0]?.models),
					);
				},
			);

			get().setStatus({
				status: "initialized",
				error: null,
			});

			console.log("[DOJO]: initialized");
			set({ existingSubscription: subscription });
		} catch (e) {
			get().setStatus({
				status: "error",
				error: (e as Error).message || "SYNC FAILURE",
			});
			console.error("Error setting up entity sync:", e);
		}
	},
}));

// Utility function
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

const DojoStore = () => ({
	...useDojoStore.getState(),
	set: useDojoStore.setState,
	subscribe: useDojoStore.subscribe,
});

export default DojoStore;
