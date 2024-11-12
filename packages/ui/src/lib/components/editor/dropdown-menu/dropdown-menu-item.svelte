<script lang="ts">
  import {cn} from "$lib/utils.js";
  import {DropdownMenu as DropdownMenuPrimitive} from "bits-ui";
  import {optionStyle} from "$lib/components/editor/options";

  let {
    ref = $bindable(null),
    class: className,
    inset,
    ...restProps
  }: DropdownMenuPrimitive.ItemProps & {
    inset?: boolean;
  } = $props();
</script>

<DropdownMenuPrimitive.Item
  bind:ref
  class={cn(
    optionStyle,
    "has-[.shortcut]:pr-2 has-[.shortcut]:gap-8 has-[.shortcut]:justify-between",
		inset && "pl-8",
		className
	)}
  {...restProps}
/>
