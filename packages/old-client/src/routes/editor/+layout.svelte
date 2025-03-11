<script lang="ts">
  import "$styles/app.css";
  import "$styles/editor.css";
  import { user_store } from "$lib/stores/user_store";
  import { onMount } from "svelte";

  onMount(() => {
    user_store.set({
      ...user_store.get(),
      dark_mode: localStorage.theme === "dark",
    });

    user_store.subscribe((state) => {
      if (state.dark_mode) {
        localStorage.theme = "dark";
      } else {
        localStorage.theme = "light";
      }
      document.documentElement.classList.toggle(
        "dark",
        localStorage.theme === "dark" ||
          (!("theme" in localStorage) &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    });
  });
</script>

<slot />
