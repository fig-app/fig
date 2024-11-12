<script lang="ts" module>
  import type {Snippet} from "svelte";
  import type {HTMLAttributes} from "svelte/elements";
  import type {WithChildren, WithElementRef} from "bits-ui";

  export type PanelSectionHeaderProps =
    WithElementRef<HTMLAttributes<HTMLDivElement>>
    & WithChildren;
</script>

<script lang="ts">
  import {cn} from "@fig/ui/utils";

  let {
    ref = $bindable(undefined),
    class: className,
    children
  }: PanelSectionHeaderProps = $props();
</script>

<div bind:this={ref}
     class={cn("w-full px-4 py-3 flex items-center justify-between", className)}>
  {@render children?.()}
</div>
