<script lang="ts" module>
  import type {Snippet} from "svelte";
  import type {HTMLAttributes} from "svelte/elements";
  import type {WithElementRef} from "bits-ui";

  export type InputInlineGroup = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    children: Snippet
  }
</script>

<script lang="ts">
  import {cn} from "$lib/utils.js";

  let {
    ref = $bindable(undefined),
    class: className,
    children
  }: InputInlineGroup = $props();
</script>

<div
  bind:this={ref}
  class={cn("h-fit flex rounded-md ring-primary overflow-hidden divide-x-2 divide-background has-[:focus]:ring-1 [&_.input]:border-0 [&_.input]:rounded-none [&_.input]:has-[:focus]:ring-0", className)}>
  {@render children()}
</div>
