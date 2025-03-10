<script lang="ts">
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import {
    walletStore,
    openUserProfile,
    disconnectController,
    connectController,
    setWalletData,
  } from "$lib/stores/wallet_store";

  // States and variables
  let loading = true;
  let errorMessage: string | null = null;

  // Error handling
  function handleError(error: unknown) {
    errorMessage = "An error occurred. Please try again.";
    console.error("Application error:", error);
  }

  onMount(async () => {
    if (get(walletStore).isConnected) {
      setWalletData({
        isConnected: false,
      });
    }
    // Try to connect to a previous cartridge controller
    walletStore.subscribe(async (store) => {
      if (store.controller && !store.isConnected) {
        try {
          if (await store.controller?.probe()) {
            await connectController();
          }
        } catch (error) {
          handleError(error);
        } finally {
          loading = false;
        }
      }
    });
  });
</script>

<div class="wallet-container textFreak">
  <div>Archetypal Tech Wallet Facility no:23</div>
  <div class="button-container">
    {#if loading}
      <span class="loading-text">Loading...</span>
    {:else if errorMessage}
      <div class="error-message">{errorMessage}</div>
    {:else}
      <!--For Cartride Controller -->
      {#if $walletStore.isConnected}
        <button on:click={openUserProfile}
          >{get(walletStore).username}'s Inventory</button
        >
        <span class="-|-"> -|-</span>
        <button on:click={disconnectController}>Disconnect Controller</button>
      {:else}
        <button on:click={connectController}>Connect Controller</button>
      {/if}
    {/if}
  </div>
</div>

<style>
  .wallet-container {
    font-family: monospace;
    background-color: black;
    color: var(--terminal-hash);
    border: 1px solid var(--terminal-hash);
    border-radius: 0.375rem;
    padding: 1rem;
    position: relative;
    min-height: 75px;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    align-items: center;
    justify-content: center;
  }

  .button-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 1rem;
    position: relative;
    flex-wrap: wrap; /* Ensures buttons wrap on smaller screens */
  }

  .loading-text {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(
      0,
      0,
      0,
      0.85
    ); /* Slightly darker for better contrast */
    color: var(--terminal-hash);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    font-size: 1rem; /* Larger for better visibility */
    text-align: center;
  }

  .error-message {
    color: var(--terminal-error);
    font-size: 1rem;
    margin-top: 1rem;
    text-align: center; /* Center for uniformity */
  }

  @media (max-width: 768px) {
    .button-container {
      gap: 5px;
    }
  }
</style>
