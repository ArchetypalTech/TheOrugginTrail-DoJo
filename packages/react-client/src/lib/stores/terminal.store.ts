import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

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
	terminalContent: [] as TerminalContentItem[],
	currentContentItem: null as TerminalContentItem | null,
	contentQueue: [] as TerminalContentItem[],
};

type TerminalState = typeof initialState;

export const useTerminalStore = create<
	TerminalState & { set: (state: Partial<TerminalState>) => void }
>()(
	immer((set) => ({
		...initialState,
		set,
	})),
);

const get = () => useTerminalStore.getState();
const set = get().set;

export function addTerminalContent(item: TerminalContentItem) {
	set({
		contentQueue: [...get().contentQueue, item],
	});

	// Similar to Svelte's tick, we use setTimeout with 0ms to defer execution
	setTimeout(() => {
		if (get().currentContentItem === null) {
			nextItem(null);
		}
	}, 0);
}

export function nextItem(contentItem: TerminalContentItem | null) {
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
}

export function clearTerminalContent() {
	set({ terminalContent: [] });
}

const TerminalStore = () => ({
	...useTerminalStore.getState(),
	set: useTerminalStore.setState,
	subscribe: useTerminalStore.subscribe,
	addTerminalContent,
	nextItem,
	clearTerminalContent,
});

export default TerminalStore;
