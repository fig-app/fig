<script lang="ts" module>
  import type {Snippet} from "svelte";
  import type {HTMLAttributes} from "svelte/elements";
  import type {WithElementRef} from "bits-ui";

  export type PanelRootProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    side: "left" | "right";
    children: Snippet
  }
</script>

<script lang="ts">
  import {cn} from "@fig/ui/utils";

  let {
    ref = $bindable(undefined),
    class: className,
    side,
    children
  }: PanelRootProps = $props();
</script>

<div
  class={cn("h-full absolute bg-background border-border", side === "left" ? "left-0 border-r-2" : "right-0 border-l-2", className)}>
  {@render children()}
</div>