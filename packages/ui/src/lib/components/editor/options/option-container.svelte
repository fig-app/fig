<script lang="ts" module>
  import type {Snippet} from "svelte";
  import type {HTMLAttributes} from "svelte/elements";

  export type OptionContainerProps = HTMLAttributes<HTMLDivElement> & {
    children: Snippet
  }
</script>

<script lang="ts">
  import {cn} from "$lib/utils.js";

  let {class: className, children}: OptionContainerProps = $props();
</script>

<div
  class={cn(["bg-option rounded-[12px] px-2 py-2 border border-border h-fit", className])}>
  {@render children()}
</div>
