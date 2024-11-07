<script lang="ts">
  import {DropdownMenu as DropdownMenuPrimitive} from "bits-ui";
  import {
    optionContainerStyle
  } from "$lib/components/editor/options/index.js";
  import {cn} from "$lib/utils.js";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: DropdownMenuPrimitive.SubContentProps = $props();
</script>

<DropdownMenuPrimitive.SubContent
  bind:ref
  class={cn(
    optionContainerStyle,
		className
	)}
  sideOffset={12}
  {...restProps}
/>
