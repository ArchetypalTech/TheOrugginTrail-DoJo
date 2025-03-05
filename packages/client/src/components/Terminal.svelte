<script lang="ts">
import Typewriter from "$components/Typewriter.svelte";
import {
	addTerminalContent,
	currentContentItem,
	nextItem,
	terminalContent,
} from "$lib/stores/terminal_store";
import { transferToken } from "$lib/tokens/interaction";
import { onMount, tick } from "svelte";
import { commandHandler } from "../lib/terminalCommands/commandHandler";
import { get } from "svelte/store";
import { Dojo_Status } from "$lib/stores/dojo_store";
import TerminalLine from "./TerminalLine.svelte";

let inputValue = "";
let originalInputValue = "";
let inputHistory: string[] = [];
let inputHistoryIndex = 0;
let terminalForm: HTMLFormElement;
let terminalInput: HTMLInputElement;

// State to track if we're waiting for user input for the RecipientAddress, token Id
let waitingForRecipientAddress = false;
let waitingForTokenId = false;
let recipientAddress = "";
let token_ID: number | null = null;

function handleKeyDown(e: KeyboardEvent) {
	// up down cycle through prevInputs or back to originalInputValue
	switch (e.key) {
		case "ArrowUp":
			e.preventDefault();
			if (inputHistoryIndex === 0) {
				originalInputValue = inputValue;
			}
			if (inputHistoryIndex < inputHistory.length) {
				inputHistoryIndex++;
				inputValue = inputHistory[inputHistory.length - inputHistoryIndex];
			}
			break;
		case "ArrowDown":
			e.preventDefault();
			if (inputHistoryIndex > 0) {
				inputHistoryIndex--;
				if (inputHistoryIndex === 0) {
					inputValue = originalInputValue;
				} else {
					inputValue = inputHistory[inputHistory.length - inputHistoryIndex];
				}
			}
			break;
		case "Escape":
			e.preventDefault();
			nextItem(get(currentContentItem));
			break;
		default:
			break;
	}
}

onMount(() => {
	terminalInput.focus();
	setTimeout(() => {
		if (get(Dojo_Status).status !== "spawning") {
			Dojo_Status.set({
				status: "error",
				error: "TIMEOUT",
			});
		}
	}, 5000);
});

Dojo_Status.subscribe((status) => {
	console.log(status);
	if (status.status === "spawning") return;
	if (status.status === "initialized") {
		addTerminalContent({
			text: [
				"\n",
				"The O'Ruggin Trail, no:23",
				"from the good folk at",
				"\n",
				"Archetypal Tech ✯",
				"\n\n\n\n\n\n\n\n\n\n",
			].join("\n"),
			format: "system",
			useTypewriter: true,
			speed: 1.4,
			style: "text-align: center",
		});
		addTerminalContent({
			text: 'type "spawn" to create a world, or "help"',
			format: "shog",
			useTypewriter: true,
		});
		Dojo_Status.set({
			status: "spawning",
			error: null,
		});
		return;
	}
	if (status.status === "error") {
		addTerminalContent({
			text: `FATAL+ERROR: ${status.error}`,
			format: "error",
			useTypewriter: false,
		});
		return;
	}
});

async function submitForm(e: SubmitEvent) {
	e.preventDefault();
	const command = inputValue;
	inputHistoryIndex = 0;
	if (command === "") return;
	inputValue = "";
	await tick();
	// Add command to history and display
	inputHistory = [...inputHistory, command];
	commandHandler(command);
}

// Handle the Recipient Address introduced
async function handleRecipientAddressInput(e: SubmitEvent) {
	e.preventDefault();
	const address = inputValue.trim();

	if (!address) {
		addTerminalContent({
			text: "Invalid address. Please provide a valid account address.",
			format: "error",
			useTypewriter: true,
		});
		return;
	}

	recipientAddress = address;
	waitingForRecipientAddress = false;

	// Now ask for the token ID
	addTerminalContent({
		text: "Please provide the token ID of the Ferry Ticket you want to transfer.",
		format: "shog",
		useTypewriter: true,
	});

	waitingForTokenId = true; // Enable token ID input state
	inputValue = "";
	await tick();
}

// Handle the Ferry Ticket ID
async function handleTokenIdInput(e: SubmitEvent) {
	e.preventDefault();
	const tokenIdInput = inputValue.trim();

	if (!tokenIdInput || Number.isNaN(Number(tokenIdInput))) {
		addTerminalContent({
			text: "Invalid token ID. Please provide a valid number.",
			format: "error",
			useTypewriter: true,
		});
		return;
	}

	token_ID = Number(tokenIdInput);
	waitingForTokenId = false;

	// Call the transfer function
	try {
		const result = await transferToken(recipientAddress, token_ID);

		// If the transfer was successful, display the result
		addTerminalContent({
			text: `${result}.`,
			format: "shog",
			useTypewriter: true,
		});
	} catch (error) {
		// Handle specific error case for USER_REFUSED_OP
		if ((error as Error).message.includes("USER_REFUSED_OP")) {
			addTerminalContent({
				text: `Transaction rejected by user. Please check your wallet and try again.`,
				format: "error",
				useTypewriter: true,
			});
		} else {
			// Handle general errors
			addTerminalContent({
				text: `Error transferring ticket: ${(error as Error).message || "An unknown error occurred."}`,
				format: "error",
				useTypewriter: true,
			});
		}
	}

	// Reset state after transfer
	recipientAddress = "";
	token_ID = null;
	waitingForTokenId = false; // Ensure the form is ready for the next input
	inputValue = "";
	await tick();
}
</script>

<form
  bind:this={terminalForm}
  on:submit={async (e) => {
    terminalInput.disabled = true;
    if (waitingForRecipientAddress) {
      await handleRecipientAddressInput(e);
    } else if (waitingForTokenId) {
      await handleTokenIdInput(e);
    } else {
      await submitForm(e); // Normal command processing
    }
    terminalInput.disabled = false;
    terminalInput.focus();
  }}
  on:click={(e) => terminalInput.focus()}
  on:keydown={(e) => terminalInput.focus()}
  aria-label="Terminal"
  role=""
  id="terminal"
  class="font-mono overflow-y-auto h-full bg-black text-green-500 border rounded-md p-4 w-full"
	style={`border-color: ${$Dojo_Status.status === "error" ? "var(--terminal-error)" : "var(--terminal-system)"}`}
>
  <div id="scroller" class="flex items-end flex-col bottom-0 w-full">
    {#each $terminalContent as content}
      <TerminalLine {content} />
    {/each}
    <Typewriter
      terminalContent={$currentContentItem}
    />
    <!-- </ul> -->
		{#if $Dojo_Status.status === "spawning"}
    <div id="scroller" class="w-full flex flex-row gap-2">
      <span>&#x3e;</span><input
        class="bg-black text-green-700 w-full"
        type="text"
        bind:value={inputValue}
        bind:this={terminalInput}
        on:keydown={(e) => handleKeyDown(e)}
      />
      <div id="input-anchor" />
    </div>
		{/if}
  </div>
</form>
<style>
  input {
    outline: none;
  }
</style>
