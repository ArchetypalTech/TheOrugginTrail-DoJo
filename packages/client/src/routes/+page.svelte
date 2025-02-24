<script lang="ts">

  import { Terminal, Wallet, ToriiSub, DebugTerminal, HelpTerminal } from "$components";
  import { setupThree } from "../three";
  import { getEntityIdFromKeys } from "$lib/utils";
  import { onMount } from "svelte";
  import { windowsStore, WindowType } from "$lib/stores/windows_store";
  import { helpStore } from '$lib/stores/help_store';
  import CameraShake from "$components/CameraShake.svelte";
  import Ambient from "$components/Ambient.svelte";
       
  
  const ENTITY_ID = 23;
  const entityId = getEntityIdFromKeys(ENTITY_ID);
  console.log("ID:------------> ", entityId);

  let hasError = false;
  let ambientSoundComponent: { switchTone: () => void };

   

    function handleError(error: any) {
        hasError = true;
        console.error('Application error:', error);
    }    

    onMount(async() => {
        try {
            setupThree();
        } catch (error) {
            handleError(error);
        }
        
    });
</script>

<style>
    :global(:root) {
        --terminal-width: 30%;
        --available-space: calc(100% - var(--terminal-width));
        --debug-width: calc(var(--terminal-width) * 0.8);
        --debug-margin: 2rem;
    }
</style>

<div class="w-screen h-screen relative bg-black">
  {#if !hasError}
      <div id="viewport" class="absolute inset-0 z-0"></div>
      <CameraShake />
      <Ambient 
          bind:this={ambientSoundComponent}
          tonalFrequency={220}
          tonalFrequency2={330}
          transitionTime={2}
      />

      <div class="relative z-10 w-full h-full">
          <div class="absolute w-[30%] h-2/3 min-w-[350px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col">
              <Wallet />
              <Terminal />
              <ToriiSub {entityId} />
          </div>

          {#if $windowsStore[WindowType.DEBUG]}
              <div class="absolute top-5" 
                   style="width: var(--debug-width); left: var(--debug-margin);">
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