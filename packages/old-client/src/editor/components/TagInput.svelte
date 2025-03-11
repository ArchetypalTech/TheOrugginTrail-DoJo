<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let value: string[] = []; // tag list
  let input = ""; // input value

  const dispatch = createEventDispatcher();
  // pressed checks keyboard event for comma or Enter key.
  // If found, adds 'value' in the tag list.
  // REM: On the 'blur' event, if we exit the field with
  //      someting inside, consider it as a tag.
  function pressed(event: FocusEvent | KeyboardEvent) {
    // Check if conditions are met to do something.
    // If not, exit as early as possible.
    if (
      event.type !== "blur" &&
      (event as KeyboardEvent).key !== "," &&
      (event as KeyboardEvent).key !== "Enter"
    )
      return;

    // Clean the remaining comma in input.
    input = input.replace(",", "").trim();
    // remove empty
    if (input === "" || input.match(/^\s*$/) || value.includes(input)) {
      input = "";
      return;
    }

    value = [...value, input];
    input = "";
    dispatch("change", {
      value,
    });
  }

  // Del removes item from Taglist
  function del(idx: number) {
    value.splice(idx, 1);
    // biome-ignore lint/correctness/noSelfAssign: <@dev required to force parent to update>
    value = value;
    dispatch("change", {
      value,
    });
  }
</script>

<input
  list="tag_suggestion"
  on:blur={pressed}
  on:keyup={pressed}
  bind:value={input}
  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
/>
<div>
  {#each value as t, i}
    <span class="tag">
      {t} <a href="#del" class="tag-handler" on:click={() => del(i)}>⨉</a>
    </span>
  {/each}
</div>

<style lang="postcss">
  @reference "tailwindcss";

  .tag-handler {
    @apply ml-2 text-black;
  }

  .tag a {
    @apply decoration-0;
  }
</style>
