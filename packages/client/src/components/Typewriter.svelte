<script lang="ts">
import { onDestroy } from "svelte";
export let text: string;
export const sentenceDelay: number = 2000;
export const minTypingDelay: number = 30;
export const maxTypingDelay: number = 200;

let displayText: string = "";
let interval: ReturnType<typeof setInterval>;

function getRandomDelay(min: number, max: number, char: string) {
	if (min < 1) return min;
	const extraDelay = /[,.!?]/.test(char) ? 20 : /[ ]/.test(char) ? 10 : 0;
	return Math.floor(Math.random() * (max - min + 1)) + min + extraDelay;
}

function typeText() {
	// Fast mode - instant display
	if (minTypingDelay === 0 && maxTypingDelay === 0 && sentenceDelay === 0) {
		displayText = text.replace(/\n/g, "<br>").replace(/\t/g, "&emsp;");
		return;
	}

	let currentIndex = 0;
	clearInterval(interval);

	interval = setInterval(() => {
		if (currentIndex >= text.length) {
			clearInterval(interval);
			return;
		}

		const char = text[currentIndex];
		displayText += char === "\n" ? "<br>" : char === "\t" ? "&emsp;" : char;
		currentIndex++;
	}, minTypingDelay);
}

$: {
	displayText = "";
	typeText();
}

onDestroy(() => {
	clearInterval(interval);
});
</script>
  
<div>{@html displayText}</div>