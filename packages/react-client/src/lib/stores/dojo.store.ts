import type { InitDojo } from "../lib/dojo";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
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
// Create initial state object
const initialState = {
	status: {
		status: "loading",
		error: null,
	} as DojoStatus,
	outputter: undefined as Outputter | undefined,
	config: undefined as Awaited<ReturnType<typeof InitDojo>> | undefined,
	terminalContent: [] as TerminalContentItem[],
	currentContentItem: null as TerminalContentItem | null,
	contentQueue: [] as TerminalContentItem[],
	lastProcessedText: "",
	trimmedNewText: "",
	timeout: Date.now(),
	existingSubscription: undefined as unknown | undefined,
};

type DojoState = typeof initialState;

export const useDojoStore = create<
	DojoState & { set: (state: Partial<DojoState>) => void }
>()(
	immer((set) => ({
		...initialState,
		set,
	})),
);

const get = () => useDojoStore.getState();
const set = get().set;

// Actions
const setStatus = (status: DojoStatus) => set({ status });
const setOutputter = (outputter: Outputter | undefined) => {
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
			addTerminalContent({
				text: line,
				format: "out",
				useTypewriter: true,
			});
		}
	}
};

const addTerminalContent = (item: TerminalContentItem) => {
	set({
		contentQueue: [...get().contentQueue, item],
	});

	// Similar to Svelte's tick, we use setTimeout with 0ms to defer execution
	setTimeout(() => {
		if (get().currentContentItem === null) {
			nextItem(null);
		}
	}, 0);
};
const nextItem = (contentItem: TerminalContentItem | null) => {
	const state = get();

	// Check if contentItem is in the currentItem
	if (contentItem && state.currentContentItem === contentItem) {
		set({
			terminalContent: [...state.terminalContent, contentItem],
			currentContentItem: null,
		});
	}

	if (state.contentQueue.length > 0) {
		const nextItem = state.contentQueue[0];
		if (nextItem) {
			set({
				contentQueue: state.contentQueue.filter((item) => item !== nextItem),
				currentContentItem: nextItem,
			});
		}
	}
};
const clearTerminalContent = () => set({ terminalContent: [] });
const initializeConfig = async (
	config: Awaited<ReturnType<typeof InitDojo>>,
) => {
	set({ config });
	const { existingSubscription } = get();

	if (config === undefined) return;

	console.log("[DOJO]: CONFIG ", config);

	if (existingSubscription !== undefined) return;

	try {
		const [initialEntities, subscription] = await config.sub(23, (response) => {
			if (response.error) {
				console.error("Error setting up entity sync:", response.error);
				setStatus({
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
				setOutputter(outputData as Outputter);
				return;
			}

			console.info(
				"[DOJO]: initial response",
				JSON.stringify(response?.data?.[0]?.models),
			);
		});

		setStatus({
			status: "initialized",
			error: null,
		});

		console.log("[DOJO]: initialized");
		set({ existingSubscription: subscription });
	} catch (e) {
		setStatus({
			status: "error",
			error: (e as Error).message || "SYNC FAILURE",
		});
		console.error("Error setting up entity sync:", e);
	}
};

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
	setStatus,
	setOutputter,
	addTerminalContent,
	nextItem,
	clearTerminalContent,
	initializeConfig,
});

export default DojoStore;
