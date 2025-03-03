<!-- /*
 *
 * MeaCulpa (mc) 2024 lbdl | itrainspiders
 */ -->

<script lang="ts">
import { torii_gql } from "$lib/queries";
import { addTerminalContent } from "$lib/stores/terminal_store";
import { onMount } from "svelte";

export let entityId: string;
console.log("TORII_SUB_INIT:------>");

let isConnected = false;
let connError: string | null = null;
let connectionAttempts = 0;
const MAX_RETRIES = 1000;
const RETRY_DELAY = 5000;

let isListening = false;
async function initializeConnection() {
	if (isListening) return; // Prevent multiple subscriptions
	isListening = true;

	console.log("---------> start torii subscription");
	try {
		await torii_gql.listen({ id: entityId });
		isConnected = true;
		connError = null;
	} catch (error) {
		console.log("ERR: ----------> *", error);
		console.log("ERR: ----------> *");
		let err_msg = "Unknown error occurred";
		isListening = false; // Reset listening state if connection fails
		if (error.cause?.code === "ECONNREFUSED") {
			err_msg = "Cannot connect to server. Is it running?";
		} else if (error.networkError) {
			err_msg = `Network error: ${error.networkError.message}`;
		} else if (error.graphQLErrors?.length) {
			err_msg = error.graphQLErrors.map((e) => e.message).join(", ");
		} else if (error.message) {
			err_msg = error.message;
		}
		handleConnectionError(err_msg);
	}
}

function handleConnectionError(error: string) {
	console.log("err hndl");
	isConnected = false;
	connError = error;
	console.log("Subscription error:", error);

	if (connectionAttempts < MAX_RETRIES) {
		connectionAttempts++;
		console.log(`Retry attempt ${connectionAttempts}/${MAX_RETRIES}`);
		setTimeout(initializeConnection, RETRY_DELAY);
	} else {
		console.log("Maximum connection attempts reached");
	}
}

function processWhitespaceTags(input: string): string[] {
	const tagRegex = /\\([nrt])/g;
	const replacements: { [key: string]: string } = {
		n: "\n",
		r: "\r",
		t: "\t",
	};

	const processedString = input.replace(
		tagRegex,
		(match, p1) => replacements[p1] || match,
	);

	console.log("Before processing:", input);
	console.log("After processing:", processedString);

	return processedString.split("\n");
}

onMount(() => {
	initializeConnection();
	return () => {
		// if (unsubscribe) unsubscribe();
	};
});

$: if (($torii_gql.errors?.length ?? 0) > 0) {
	console.log("check err ", $torii_gql.errors);
	const err = $torii_gql.errors?.[0];
	console.log("ERR ", err);
	if (isConnected && err) {
		handleConnectionError(err.message);
	}
}

let lastProcessedText = "";
let trimmedNewText = "";
let timeout = Date.now();

$: if ($torii_gql.data?.entityUpdated?.models) {
	console.log(":------------> UPDATE");
	// Reset connection attempts on successful data
	connectionAttempts = 0;

	const outputModel = $torii_gql.data.entityUpdated.models.find(
		(model) => model?.__typename === "the_oruggin_trail_Output",
	);
	if (!outputModel) {
		throw new Error("Output model not found");
	}
	const newText = Array.isArray(outputModel.text_o_vision)
		? outputModel.text_o_vision.join("\n")
		: outputModel.text_o_vision || ""; // Ensure it's always a string

	console.log("BACON: ", newText);

	trimmedNewText = newText.trim();

	// FIXME: this impl is broken, now you don't get a response when trying the same command a few times
	if (
		trimmedNewText === lastProcessedText.trim() &&
		Date.now() - timeout < 500
	) {
		console.log("Skipping duplicate update");
		timeout = Date.now();
	} else {
		timeout = Date.now();
		const lines: string[] = processWhitespaceTags(trimmedNewText);
		lastProcessedText = trimmedNewText; // Store last processed text to avoid duplicates
		displayToriiOutput(lines).then(() => {
			console.log("Done processing");
		});
	}
}

async function displayToriiOutput(lines: string[]) {
	for (const line of lines) {
		console.log("LINE: ", line);
		addTerminalContent({
			text: line,
			format: "out",
			useTypewriter: true,
		});
	}
}
</script>

{#if !isConnected}
  {#if connectionAttempts >= MAX_RETRIES}
    <div class="text-red-500 text-sm p-2">
      <p>Connection failed: {connError}</p>
      <p>
        Please ensure the server is running at the correct address and port
        (8080).
      </p>
      <p>Refresh the page to try again.</p>
    </div>
  {:else if connError}
    <div class="text-yellow-500 text-sm p-2">
      Attempting to connect... ({connectionAttempts}/{MAX_RETRIES})
    </div>
  {/if}
{/if}

<!-- This component doesn't render anything, it just sets up and manages the subscriptions -->
