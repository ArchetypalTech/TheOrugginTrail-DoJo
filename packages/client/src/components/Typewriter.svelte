<script lang="ts">
import { nextItem, type TerminalContentItem } from "$lib/stores/terminal_store";
import { onDestroy } from "svelte";
export let terminalContent: TerminalContentItem | null;
const minTypingDelay: number = 20;
const maxTypingDelay: number = 80;

let displayText: string = "";
let interval: ReturnType<typeof setInterval>;

function typeText(contentItem: TerminalContentItem | null) {
	if (contentItem === null) {
		clearInterval(interval);
		displayText = "";
		return;
	}
	// Fast mode - instant display
	if (contentItem?.useTypewriter === false || contentItem.format !== "out") {
		nextItem(contentItem);
		return;
	}
	const text = contentItem?.text;

	let currentIndex = 0;
	clearInterval(interval);

	interval = setInterval(
		() => {
			if (currentIndex >= text.length) {
				clearInterval(interval);
				nextItem(contentItem);
				return;
			}

			const char = text[currentIndex];
			displayText += char === "\n" ? "<br>" : char === "\t" ? "&emsp;" : char;
			currentIndex++;
		},
		Math.random() * (maxTypingDelay - minTypingDelay) + minTypingDelay,
	);
}

$: {
	displayText = "";
	typeText(terminalContent);
}

onDestroy(() => {
	clearInterval(interval);
});
</script>
  
<div class="input">{@html displayText}</div>