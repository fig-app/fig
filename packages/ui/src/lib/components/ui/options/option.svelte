<script lang="ts" module>
  import type {Snippet} from "svelte";
  import type {HTMLAttributes} from "svelte/elements";

  export const optionStyle = "flex gap-2 w-full select-none outline-none items-center text-option-foreground text-sm rounded-[6px] cursor-pointer px-2 py-1 hover:bg-primary hover:text-primary-foreground [&_svg]:size-3";

  export type OptionProps = HTMLAttributes<HTMLDivElement> & {
    selected?: boolean;
    children: Snippet
  }
</script>

<script lang="ts">
  import {cn} from "$lib/utils.js";

  let {
    class: className,
    children
  }: OptionProps = $props();
</script>

<div class={cn([optionStyle, className])}>
  {@render children()}
</div>
