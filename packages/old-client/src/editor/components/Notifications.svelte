<script lang="ts">
  import "$styles/notifications.css";
  import { createEventDispatcher, onDestroy } from "svelte";

  // Props for the component
  export let type: "loading" | "error" | "success" | "info" | "warning" =
    "info";
  export let message = "";
  export let blocking = false;
  export let dismissable = true;
  export let icon: string | null = null;
  export let timeout: number | null = null;
  export let logs: Array<{ detail: Record<string, unknown> }> | null = null;

  // Event dispatcher for handling dismiss
  const dispatch = createEventDispatcher();

  // Auto-dismiss timer
  let timer: ReturnType<typeof setTimeout> | null = null;

  // Set up auto-dismiss timer if timeout is provided
  $: if (timeout && message) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      handleDismiss();
    }, timeout);
  }

  // Clean up timer on component destroy
  onDestroy(() => {
    if (timer) clearTimeout(timer);
  });

  // Handle dismiss button click
  function handleDismiss() {
    if (timer) clearTimeout(timer);
    dispatch("dismiss");
  }

  // Determine background color based on type
  $: bgColor =
    type === "error"
      ? "notification-error"
      : type === "success"
        ? "notification-success"
        : type === "warning"
          ? "notification-warning"
          : type === "loading"
            ? "notification-loading"
            : "notification-default";

  // Determine icon based on type if not provided
  $: defaultIcon =
    type === "error"
      ? "❌"
      : type === "success"
        ? "✓"
        : type === "warning"
          ? "⚠️"
          : type === "info"
            ? "ℹ️"
            : null;

  // Display icon
  $: displayIcon = icon || defaultIcon;
</script>

{#if message || blocking}
  <div class="state-notification-container {blocking ? 'blocking' : ''}">
    {#if blocking}
      <div class="overlay"></div>
    {/if}

    <div class="notification {bgColor} border px-4 py-3 rounded relative mb-4">
      <div class="flex items-center">
        {#if type === "loading"}
          <div
            class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 mr-3"
          ></div>
        {:else if displayIcon}
          <span class="mr-3">{displayIcon}</span>
        {/if}

        <span class="block sm:inline">{message}</span>

        {#if dismissable}
          <button
            class="absolute top-0 right-0 px-4 py-3"
            on:click={handleDismiss}
            aria-label="Dismiss"
          >
            <span class="text-xl">&times;</span>
          </button>
        {/if}
      </div>

      {#if logs && logs.length > 0}
        <div class="mt-4 log-container">
          {#each logs.reverse() as log}
            <div
              class="logger-item p-3 rounded mb-2 flex-col flex not-first-of-type:opacity-50"
              class:log-error={log.detail.error}
            >
              <div class="font-mono text-xs">
                {JSON.stringify(log.detail, null, 2)}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}
