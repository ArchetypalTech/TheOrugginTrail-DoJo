import type { HTMLAttributes, HtmlHTMLAttributes } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type FormatType = "input" | "hash" | "error" | "out" | "shog" | "system";
export type TerminalContentItem = {
	text: string;
	format: FormatType;
	useTypewriter?: boolean;
	speed?: number;
	style?: HTMLAttributes<HTMLDivElement>["style"];
};

const initialState = {
	terminalContent: [] as TerminalContentItem[],
	activeTypewriterLine: null as TerminalContentItem | null,
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

	if (get().activeTypewriterLine === null) {
		nextItem(null);
	}
}

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
