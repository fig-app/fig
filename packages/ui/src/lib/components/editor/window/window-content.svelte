<script lang="ts" module>
  import type {Snippet} from "svelte";
  import type {HTMLAttributes} from "svelte/elements";

  export type ContentProps = HTMLAttributes<HTMLDivElement> & {
    ref?: HTMLElement;
    children: Snippet;
  }
</script>

<script lang="ts">
  import {cn} from "$lib/utils.js";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: ContentProps = $props();
</script>

<div
  bind:this={ref}
  class={className}
  {...restProps}>
  {@render children()}
</div>