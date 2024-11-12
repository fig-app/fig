<script lang="ts" module>
  import type {Snippet} from "svelte";
  import type {HTMLAttributes} from "svelte/elements";
  import type {WithChildren, WithElementRef} from "bits-ui";

  export type PanelSectionProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & WithChildren;
</script>

<script lang="ts">
  import {cn} from "@fig/ui/utils";

  let {
    ref = $bindable(undefined),
    class: className,
    children
  }: PanelSectionProps = $props();
</script>

<div bind:this={ref} class={cn("border-t-2 border-border", className)}>
  {@render children?.()}
</div>