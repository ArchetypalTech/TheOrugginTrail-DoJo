<script lang="ts">
import { DebugTerminal, HelpTerminal, Terminal, Wallet } from "$components";
import Ambient from "$components/Ambient.svelte";
import CameraShake from "$components/CameraShake.svelte";
import { helpStore } from "$lib/stores/help_store";
import { WindowType, windowsStore } from "$lib/stores/windows_store";
import { onMount } from "svelte";
import { setupThree } from "../three";

let hasError = false;
let ambientSoundComponent: { switchTone: () => void };

function handleError(error: unknown) {
	hasError = true;
	console.error("Application error:", error);
}

onMount(async () => {
	try {
		setupThree();
	} catch (error) {
		handleError(error);
	}
});
</script>

<div class="w-screen h-screen relative bg-black overflow-hidden">
  {#if !hasError}
    <div id="viewport" class="absolute inset-0 z-0"></div>
    <CameraShake />
    <Ambient
      bind:this={ambientSoundComponent}
      tonalFrequency={220}
      tonalFrequency2={330}
      transitionTime={2}
    />

    <div class="relative z-10 w-screen h-full">
      <div
        class="absolute w-[600px] h-2/3 min-w-[600px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col"
      >
        <Wallet />
        <Terminal />
      </div>

      {#if $windowsStore[WindowType.DEBUG]}
        <div
          class="absolute top-5"
          style="width: var(--debug-width); left: var(--debug-margin);"
        >
          <DebugTerminal />
        </div>
      {/if}

      {#if $helpStore.isVisible}
        <div class="absolute top-5 right-8" style="width: var(--debug-width);">
          <HelpTerminal />
        </div>
      {/if}
    </div>
  {:else}
    <div class="flex items-center justify-center h-full">
      <div class="text-red-500 p-4">
        An error occurred. Please refresh the page to try again.
      </div>
    </div>
  {/if}
</div>

<style>
  :global(:root) {
    --terminal-width: 30%;
    --available-space: calc(100% - var(--terminal-width));
    --debug-width: calc(var(--terminal-width) * 0.8);
    --debug-margin: 2rem;
  }
</style>
