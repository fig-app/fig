<script lang="ts" module>
  import type {Snippet} from "svelte";
  import type {HTMLAttributes} from "svelte/elements";
  import type {WithElementRef} from "bits-ui";

  export type WindowTitleProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    children: Snippet
  }
</script>

<script lang="ts">
  import {cn} from "$lib/utils.js";

  let {
    ref = $bindable(undefined),
    class: className,
    children
  }: WindowTitleProps = $props();
</script>

<h3 bind:this={ref}
    class={cn("text-xs font-semibold text-foreground leading-loose self-center", className)}>
  {@render children()}
</h3>
