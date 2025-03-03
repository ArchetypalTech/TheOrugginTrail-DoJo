<script lang="ts">
import { helpStore } from "$lib/stores/help_store";
import { onMount } from "svelte";
import Typewriter from "./Typewriter.svelte";

let terminalElement: HTMLDivElement;
let currentText: string;

function scrollToBottom() {
	if (!terminalElement) return;
	setTimeout(() => {
		if (!terminalElement) return;
		terminalElement.scrollTop = terminalElement.scrollHeight;
	}, 0);
}

// Watch for changes in the help store and create a new string reference
$: currentText = $helpStore.currentText ? String($helpStore.currentText) : "";
$: isDefaultHelp = $helpStore.topic === "default";

// Scroll when text changes, but only for non-default help
$: if (currentText && terminalElement && !isDefaultHelp) {
	scrollToBottom();
}
</script>

<div class="help-terminal" class:scrollable={isDefaultHelp} class:default={isDefaultHelp} bind:this={terminalElement}>
    <div class="title">HELP SYSTEM n23</div>
    <div class="content">
        {#key currentText}
           <div>{currentText}</div>
        {/key}
    </div>
</div>

<style>
    .help-terminal {
        position: relative;
        width: 100%;
        height: 300px;  /* Default smaller height */
        background: rgba(0, 0, 0, 0.8);
        color: #ffd700;
        font-family: monospace;
        font-size: 12px;
        padding: 10px;
        border-radius: 5px;
        overflow: hidden;
        -ms-overflow-style: none;
        border: 1px solid #ffd700;
    }
    
    .help-terminal.default {
        height: 600px;  /* Larger height for default help */
    }
    
    .help-terminal.scrollable {
        overflow-y: auto;
    }
    
    .help-terminal.scrollable::-webkit-scrollbar {
        width: 8px;
    }
    
    .help-terminal.scrollable::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
    }
    
    .help-terminal.scrollable::-webkit-scrollbar-thumb {
        background-color: rgba(255, 215, 0, 0.3);
        border-radius: 4px;
    }

    .title {
        text-align: center;
        padding-bottom: 10px;
        border-bottom: 1px solid #ffd700;
        margin-bottom: 10px;
    }

    .content {
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style> 