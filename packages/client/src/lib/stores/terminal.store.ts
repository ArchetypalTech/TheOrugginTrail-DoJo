import type { HTMLAttributes } from "react";
import { StoreBuilder } from "../utils/storebuilder";
import { decodeDojoText } from "../utils/utils";

/**
 * Types of formatting that can be applied to terminal content.
 * @typedef {string} FormatType
 */
export type FormatType = "input" | "hash" | "error" | "out" | "shog" | "system";

export type TerminalContentItem = {
	text: string;
	format: FormatType;
	useTypewriter?: boolean;
	speed?: number;
	style?: HTMLAttributes<HTMLDivElement>["style"];
};

const {
	get,
	set,
	useStore: useTerminalStore,
	createFactory,
} = StoreBuilder({
	terminalContent: [] as TerminalContentItem[],
	activeTypewriterLine: null as TerminalContentItem | null,
	contentQueue: [] as TerminalContentItem[],
});

/**
 * Adds a new item to the terminal content queue.
 * If no typewriter effect is currently active, it will start processing the queue.
 * @param {TerminalContentItem} item - The terminal content item to add
 */
export function addTerminalContent(item: TerminalContentItem) {
	item.text = decodeDojoText(item.text);
	set({
		contentQueue: [...get().contentQueue, item],
	});

	if (get().activeTypewriterLine === null) {
		nextItem(null);
	}
}

/**
 * Processes the next item in the terminal content queue.
 * If a typewriter effect has finished, adds it to the permanent content.
 * @param {TerminalContentItem|null} newContent - The content that has finished its typewriter effect, if any
 */
export function nextItem(newContent: TerminalContentItem | null) {
	const state = get();

	// Check if newContent is in the currentItem
	if (newContent && state.activeTypewriterLine === newContent) {
		set({
			terminalContent: [...state.terminalContent, newContent],
			activeTypewriterLine: null,
		});
	}

	if (state.contentQueue.length > 0) {
		const nextItem = state.contentQueue[0];
		if (nextItem) {
			set({
				contentQueue: state.contentQueue.filter((item) => item !== nextItem),
				activeTypewriterLine: nextItem,
			});
		}
	}
}

/**
 * Clears all content from the terminal.
 */
export function clearTerminalContent() {
	set({ terminalContent: [] });
}

/**
 * Factory function that returns all terminal store state and methods.
 * Can be used to access the terminal store outside of React components.
 * @returns {Object} The terminal store state and methods
 */
const TerminalStore = createFactory({
	addTerminalContent,
	nextItem,
	clearTerminalContent,
});

export default TerminalStore;
export { useTerminalStore };
