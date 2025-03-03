import { tick } from "svelte";
import { get, writable } from "svelte/store";
export type FormatType = "input" | "hash" | "error" | "out" | "shog" | "system";

export type TerminalContentItem = {
	text: string;
	format: FormatType;
	useTypewriter?: boolean;
};

export const terminalContent = writable<TerminalContentItem[]>([]);
export const currentContentItem = writable<TerminalContentItem | null>(null);
export const contentQueue = writable<TerminalContentItem[]>([]);

export function addTerminalContent(item: TerminalContentItem) {
	contentQueue.update((content) => [...content, item]);
	tick();
	if (get(currentContentItem) === null) {
		nextItem(null);
	}
}

export function nextItem(contentItem: TerminalContentItem | null) {
	// check if contentItem is in the currentItem
	if (contentItem && get(currentContentItem) === contentItem) {
		terminalContent.update((content) => [...content, contentItem]);
		currentContentItem.set(null);
	}
	if (get(contentQueue).length > 0) {
		const nextItem = get(contentQueue).shift();
		if (nextItem) {
			contentQueue.update((content) =>
				content.filter((item) => item !== nextItem),
			);
			currentContentItem.set(nextItem);
		}
	}
}

export function clearTerminalContent() {
	terminalContent.set([]);
}
