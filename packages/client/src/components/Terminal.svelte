<script lang="ts">
	import { onMount, tick } from "svelte";
	import { sendCommand } from "../api/terminal";
	import { terminalContent, addTerminalContent, clearTerminalContent, type TerminalContentItem } from "$lib/stores/terminal_content_store";
    import Typewriter from "$components/Typewriter.svelte";
    import { windowsStore, WindowType } from '$lib/stores/windows_store';
    import { helpStore, handleHelp } from '$lib/stores/help_store';
    import HelpTerminal from './HelpTerminal.svelte';
    import { audioStore } from '$lib/stores/audio_store';
	import {connectedToArX, connectedToCGC,} from '../Wallets/Wallet_constants';	
	import {getBalance, getBalance2, mintToken, transferToken} from '../TOTToken/tot_NFT_Interaction';
    import { get } from "svelte/store";

	let headerText = [
		"Archetypal Tech. Innovation in frustration",
		"",
		"\n",
		"The O'Ruggin Trail, no:23",
		"from the good folk at",		
	];
	let inputValue = "";
	let originalInputValue = "";
	let inputHistory: string[] = [];
	let inputHistoryIndex = 0;
	let terminalForm: HTMLFormElement;
	let terminalInput: HTMLInputElement;


	/**
	 * we actually have no concept of a user at this point
	 * but this will be a combination of address and some guid we will
	 * generate from somewhere
	 */
	let step = 1;
  	let username = "";
  	let roomID = 0;

	// State to track if we're waiting for user input for the RecipientAddress, token Id
	let waitingForRecipientAddress = false;
	let waitingForTokenId = false;
	let recipientAddress = '';
	let token_ID: number | null = null;
	
	function handleKeyDown(e: KeyboardEvent) {
		// up down cycle through prevInputs or back to originalInputValue
		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (inputHistoryIndex === 0) {
				originalInputValue = inputValue;
			}
			if (inputHistoryIndex < inputHistory.length) {
				inputHistoryIndex++;
				inputValue = inputHistory[inputHistory.length - inputHistoryIndex];
			}
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			if (inputHistoryIndex > 0) {
				inputHistoryIndex--;
				if (inputHistoryIndex === 0) {
					inputValue = originalInputValue;
				} else {
					inputValue = inputHistory[inputHistory.length - inputHistoryIndex];
				}
			}
		}
	}

	onMount(async () => {
		addTerminalContent({ 
			text: "type \"spawn\" to create a world, or \"help\"", 
			format: 'shog', 
			useTypewriter: true });
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
		addTerminalContent({ text: command, format: 'input', useTypewriter: false });

		// Parse command and arguments
		const [cmd, ...args] = command.trim().toLowerCase().split(/\s+/);

		// Handle built-in commands
		switch (cmd) {
			case 'clear':
				clearTerminalContent();
				return;

			case 'debug':
				windowsStore.toggle(WindowType.DEBUG);
				addTerminalContent({ 
					text: `Debug window ${windowsStore.get(WindowType.DEBUG) ? 'enabled' : 'disabled'}`, 
					format: 'out', 
					useTypewriter: false 
				});
				return;

			case 'help':
			case 'help-close':
				handleHelp(command);
				addTerminalContent({ 
					text: `Help window ${$helpStore.isVisible ? 'enabled' : 'disabled'}`, 
					format: 'input', 
					useTypewriter: false 
				});
				return;

			case 'hear':
				if (args.length === 0 || args[0] === 'help') {
					helpStore.showHelp('hear');
					return;
				}

				const [target, state] = args;
				if (target === 'wind') {
					console.log("-----------> wind off");
					audioStore.toggleWind();
					addTerminalContent({ 
						text: state === 'off' ? 'Wind sound disabled' : 'Wind sound enabled', 
						format: 'out', 
						useTypewriter: false 
					});
				} else if (target === 'tone') {
					console.log("-----------> tone off");
					audioStore.toggleTone();
					addTerminalContent({ 
						text: state === 'off' ? 'Tonal sound disabled' : 'Tonal sound enabled', 
						format: 'out', 
						useTypewriter: false 
					});
				} else if (target === 'cricket') {
					console.log("-----------> cricket off");
					audioStore.toggleCricket();
					addTerminalContent({ 
						text: state === 'off' ? 'Cricket sound disabled' : 'Cricket sound enabled', 
						format: 'out', 
						useTypewriter: false 
					});
				}			
				return;
			case 'balance-tottokens':
				if (get(connectedToArX) || get(connectedToCGC)) {
					try {
							const result = await getBalance();  // Await the Promise here
							addTerminalContent({ 
								text: `${result}`, 
								format: 'shog', 
								useTypewriter: true 
							});
						} catch (error) {
							console.error('Error fetching balance:', error);
							addTerminalContent({
									text: `Error getting your ticket balance: ${error.message || 'An unknown error occurred.'}`,
									format: 'error',
									useTypewriter: true
								});
						}
				return;
				} else {
					addTerminalContent({ 
								text: 'You are not in the realm of shoggoth yet...', 
								format: 'shog', 
								useTypewriter: true 
							});					
				}
				return;
			// Mint Ferry Ticket logic
			/*
			case 'mint-tottoken':
				if (get(connectedToArX) || get(connectedToCGC)) {
					try {
							const result = await mintToken();  // Await the Promise here
							addTerminalContent({ 
								text: `${result}`, 
								format: 'shog', 
								useTypewriter: true 
							});
						} catch (error) {
							// Handle specific error case for USER_REFUSED_OP
							if (error.message.includes('USER_REFUSED_OP')) {
								addTerminalContent({
									text: `${error.message}`,
									format: 'error',
									useTypewriter: true
								});
							} else {
								// Handle general errors
								addTerminalContent({
									text: `Error minting a ticket: ${error.message || 'An unknown error occurred.'}`,
									format: 'error',
									useTypewriter: true
								});
							}
						}
				return;
				} else {
					addTerminalContent({ 
								text: 'You are not in the realm of shoggoth yet...', 
								format: 'shog', 
								useTypewriter: true 
							});
					return;
				}
			*/
			case 'transfer-tottoken':
					if (get(connectedToArX) || get(connectedToCGC)) {
						// Prompt for the recipient account address
						addTerminalContent({ 
							text: `With whom are you sharing your ticket? Please provide the account address.`, 
							format: 'shog', 
							useTypewriter: true 
						});

						// Store the state to await the user's input
						waitingForRecipientAddress = true; // This is a state variable that you'll manage to track the input request
						return;
					} else {
						addTerminalContent({ 
							text: 'You are not in the realm of shoggoth yet...', 
							format: 'shog', 
							useTypewriter: true 
						});
						return;
					}
						
		}

		// Handle other commands via GQL
		try {
			// Check if the player is connected to Argent X or to Cartridge controller
			if (get(connectedToArX) || get(connectedToCGC) ) {
				// Get the player's balance number and check if he can play or not
				const tokenBalance = await getBalance2();  // Await the Promise here
				if (tokenBalance > 0 || import.meta.env.DEV) {
					const response = await sendCommand(command);
				} else {
					addTerminalContent({
						text: `You have ${tokenBalance} TOT Tokens and cannot proceed on the journey.`,
						format: 'error',
						useTypewriter: true,
					});
				}
				
				/**
				 * we dont actually do anything now as we wait on the GQL subscription
				 * to actually return us bacon, via the `ToriiSub` component which updates
				 * the store and thus the UI
				 * */	
			} else {
				let warning_text = "shoggoth needs you to be in his realm...";
				addTerminalContent({text: warning_text, format: 'shog', 
				useTypewriter: true })
			}
					
		} catch (e) {
			console.error(e);
		}
	}

	// Handle the Recipient Address introduced
	async function handleRecipientAddressInput(e: SubmitEvent) {
		e.preventDefault();
		const address = inputValue.trim();

		if (!address) {
			addTerminalContent({ 
				text: "Invalid address. Please provide a valid account address.", 
				format: 'error', 
				useTypewriter: true });
			return;
		}

		recipientAddress = address;
		waitingForRecipientAddress = false;

		// Now ask for the token ID
		addTerminalContent({ 
			text: 'Please provide the token ID of the Ferry Ticket you want to transfer.',
			format: 'shog',
			useTypewriter: true 
		});

		waitingForTokenId = true; // Enable token ID input state
		inputValue = "";
		await tick();
	}

	// Handle the Ferry Ticket ID
	async function handleTokenIdInput(e: SubmitEvent) {
		e.preventDefault();
		const tokenIdInput = inputValue.trim();

		if (!tokenIdInput || isNaN(Number(tokenIdInput))) {
			addTerminalContent({ text: "Invalid token ID. Please provide a valid number.", format: 'error', useTypewriter: true });
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
				format: 'shog',
				useTypewriter: true
			});
		} catch (error) {
			// Handle specific error case for USER_REFUSED_OP
			if (error.message.includes('USER_REFUSED_OP')) {
				addTerminalContent({
					text: `Transaction rejected by user. Please check your wallet and try again.`,
					format: 'error',
					useTypewriter: true
				});
			} else {
				// Handle general errors
				addTerminalContent({
					text: `Error transferring ticket: ${error.message || 'An unknown error occurred.'}`,
					format: 'error',
					useTypewriter: true
				});
			}
		}

		// Reset state after transfer
		recipientAddress = '';
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
	class="font-mono overflow-y-auto h-full bg-black text-green-500 border border-green-500 rounded-md p-4"
>
	<div class="text-center">
		{#each headerText as headerLine}
			<div class="min-h-6">{headerLine}</div>
		{/each}
		<div class="bastard">
			<b>B</b>est <b>A</b>rchetypal <b>S</b>ystem <b>T</b>erminals <b>A</b>nd <b>R</b>etrograde
			<b>D</b>evices
		</div>
	</div>
	<br />
	<ul class="w-full">
		{#each $terminalContent as content}
			{#if content.useTypewriter}
				<Typewriter
					text={content.text} 
					sentenceDelay={1000}
					minTypingDelay={30}
					maxTypingDelay={100}
					/>
			{:else}
				<li class="break-words {content.format}-style">{content.text}</li>
			{/if}
		{/each}
	</ul>
	<div class="w-full flex flex-row gap-2">
		<span>&#x3e;</span><input
			class="bg-black text-green-700 w-full"
			type="text"
			bind:value={inputValue}
			bind:this={terminalInput}
			on:keydown={(e) => handleKeyDown(e)}
		/>
	</div>
</form>

<style>
	input {
		outline: none;
	}
	.hash-style {
		color: #ffd700; 
		font-weight: bold;
		font-size: 0.7em; 
	}
	.out-style {
		color: #309810; 
		/* font-weight: bold; */
		font-size: 1.1em; 
	}
	.shog-style {
		color: #309810; 
		/* font-weight: bold; */
		font-size: 1.1em; 
	}
	.input-style {
		color: #25642a; 
		/* font-weight: bold; */
		font-size: 0.9em; 
	}
</style>
