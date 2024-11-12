<script lang="ts" module>
  import type {Snippet} from "svelte";
  import type {HTMLAttributes} from "svelte/elements";
  import type {WithChildren, WithElementRef} from "bits-ui";

  export type PanelSectionTitleProps =
    WithElementRef<HTMLAttributes<HTMLDivElement>>
    & WithChildren;
</script>

<script lang="ts">
  import {cn} from "@fig/ui/utils";

  let {
    ref = $bindable(undefined),
    class: className,
    children
  }: PanelSectionTitleProps = $props();
</script>

<div bind:this={ref}
     class={cn("text-xs font-semibold text-foreground leading-loose self-center", className)}>
  {@render children?.()}
</div>