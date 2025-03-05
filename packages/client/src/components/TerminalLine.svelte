<script lang="ts">
import type { TerminalContentItem } from "$lib/stores/terminal_store";

export let content: TerminalContentItem | null;
</script>

{#if content !== null}
  <div
    class="terminal-line"
    class:shog={content.format === "shog"}
    class:out={content.format === "out"}
    class:input={content.format === "input"}
    class:hash={content.format === "hash"}
    class:error={content.format === "error"}
    class:system={content.format === "system"}
    style={content.style}
  >
    {@html content.text.replace(/\n/g, "<br>").replace(/\t/g, "&emsp;")}
  </div>
{/if}

<style>
  .terminal-line {
    font-size: 1.02em;
  }
  .terminal-line.hash {
    color: var(--terminal-hash);
    font-weight: bold;
  }
  .terminal-line.out {
    color: var(--terminal-out);
  }
  .terminal-line.shog {
    color: var(--terminal-shog);
  }
  .terminal-line.input {
    color: var(--terminal-input); 
  }
  .terminal-line.system {
    color: var(--terminal-system);
  }
	.terminal-line.error {
		color: var(--terminal-error);
	}
</style>
