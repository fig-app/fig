<script lang="ts" module>
  import type {Snippet} from "svelte";
  import type {HTMLAttributes} from "svelte/elements";

  export const optionStyle = "relative z-50 flex gap-2 w-full select-none outline-none items-center whitespace-nowrap text-option-foreground text-sm rounded-[6px] cursor-pointer px-2 py-1 pl-7 pr-7 hover:bg-primary hover:text-primary-foreground [&_svg]:size-3 [&_svg]:absolute [&_svg]:left-2 [&_svg]:flex [&_svg]:items-center [&_svg]:justify-center";

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

<button class={cn([optionStyle, className])}>
  {@render children()}
</button>
