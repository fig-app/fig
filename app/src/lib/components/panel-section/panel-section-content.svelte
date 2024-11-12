<script lang="ts" module>
  import type {Snippet} from "svelte";
  import type {HTMLAttributes} from "svelte/elements";
  import type {WithChildren, WithElementRef} from "bits-ui";

  export type PanelSectionContentProps =
    WithElementRef<HTMLAttributes<HTMLDivElement>>
    & WithChildren;
</script>

<script lang="ts">
  import {cn} from "@fig/ui/utils";

  let {
    ref = $bindable(undefined),
    class: className,
    children
  }: PanelSectionContentProps = $props();
</script>

<div bind:this={ref} class={cn("px-4", className)}>
  {@render children?.()}
</div>