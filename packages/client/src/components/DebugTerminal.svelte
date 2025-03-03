<script lang="ts">
import { onMount } from "svelte";

let messages: string[] = [];
let terminalElement: HTMLDivElement;
let autoScroll = true;

function scrollToBottom() {
	if (!terminalElement || !autoScroll) return;

	setTimeout(() => {
		terminalElement.scrollTop = terminalElement.scrollHeight;
	}, 0);
}

onMount(() => {
	const originalConsoleLog = console.log;
	console.log = (...args) => {
		const message = args
			.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg))
			.join(" ");
		messages = [...messages, message].slice(-50);
		originalConsoleLog.apply(console, args);
		scrollToBottom();
	};

	return () => {
		console.log = originalConsoleLog;
	};
});

// Handle manual scrolling
function handleScroll() {
	if (!terminalElement) return;

	const isScrolledToBottom =
		Math.abs(
			terminalElement.scrollHeight -
				terminalElement.clientHeight -
				terminalElement.scrollTop,
		) < 2;

	autoScroll = isScrolledToBottom;
}

// Still keep the reactive statement as a backup
$: if (messages.length) scrollToBottom();
</script>

<div 
    class="debug-terminal" 
    bind:this={terminalElement}
    on:scroll={handleScroll}
>
    {#each messages as message}
        <div class="message">{message}</div>
    {/each}
</div>

<style>
    .debug-terminal {
        position: relative;
        width: 100%;
        max-height: 200px;
        background: rgba(0, 0, 0, 0.8);
        color: #00ff00;
        font-family: monospace;
        font-size: 12px;
        padding: 10px;
        border-radius: 5px;
        overflow-y: auto;
        scrollbar-width: none;  /* Firefox */
        -ms-overflow-style: none;  /* IE and Edge */
    }
    
    /* Hide scrollbar for Chrome, Safari and Opera */
    .debug-terminal::-webkit-scrollbar {
        display: none;
    }
    
    /* Show scrollbar on hover */
    .debug-terminal:hover {
        scrollbar-width: auto;  /* Firefox */
        -ms-overflow-style: auto;  /* IE and Edge */
    }
    
    .debug-terminal:hover::-webkit-scrollbar {
        display: block;
        width: 8px;
    }
    
    .debug-terminal:hover::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
    }
    
    .debug-terminal:hover::-webkit-scrollbar-thumb {
        background-color: rgba(0, 255, 0, 0.3);
        border-radius: 4px;
    }
    
    .message {
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style> 