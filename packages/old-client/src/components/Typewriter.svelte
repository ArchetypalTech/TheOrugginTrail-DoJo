<script lang="ts">
  import {
    nextItem,
    type TerminalContentItem,
  } from "$lib/stores/terminal_store";
  import { onDestroy } from "svelte";
  import TerminalLine from "./TerminalLine.svelte";
  import { user_store } from "$lib/stores/user_store";
  export let terminalContent: TerminalContentItem | null;
  const minTypingDelay: number = 2;
  const maxTypingDelay: number = 9;

  let displayContent: TerminalContentItem | null = null;
  let interval: ReturnType<typeof setInterval>;

  function typeText(contentItem: TerminalContentItem | null) {
    if (contentItem === null) {
      clearInterval(interval);
      displayContent = null;
      return;
    }
    // Fast mode - instant display
    if (
      contentItem?.useTypewriter === false ||
      user_store.get().typewriter_effect === false
    ) {
      nextItem(contentItem);
      return;
    }
    const text = contentItem?.text;
    // make a clone for anim
    displayContent = Object.assign({}, contentItem);
    displayContent.text = "";

    let currentIndex = 0;
    clearInterval(interval);

    interval = setInterval(
      () => {
        if (currentIndex >= text.length) {
          clearInterval(interval);
          nextItem(contentItem);
          return;
        }

        const char = text[currentIndex];
        displayContent!.text += char;
        currentIndex++;
      },
      (terminalContent?.speed || 1) *
        Math.random() *
        (maxTypingDelay - minTypingDelay) +
        minTypingDelay
    );
  }

  $: {
    displayContent = null;
    typeText(terminalContent);
  }

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

{#if displayContent !== null}
  <TerminalLine content={displayContent} />
{/if}
