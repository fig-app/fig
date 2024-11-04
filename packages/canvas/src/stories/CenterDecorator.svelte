<script lang="ts">
  import type { Snippet } from "svelte";

  let {children}: {children: Snippet} = $props();
</script>

<div>
    {@render children()}
</div>

<style>
    div {
        height: 100vh;
        display: grid;
        place-items: center;
    }
</style>
