<script lang="ts">
  import {onDestroy} from "svelte";
  import {keys} from "$lib/stores/keys";

  onDestroy(() => {
    keys.destroy();
  })
</script>