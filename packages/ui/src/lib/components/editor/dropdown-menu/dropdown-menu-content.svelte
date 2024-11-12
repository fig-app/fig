<script lang="ts">
  import {cn} from "$lib/utils.js";
  import {DropdownMenu as DropdownMenuPrimitive} from "bits-ui";
  import {
    optionContainerStyle
  } from "$lib/components/editor/options";

  let {
    ref = $bindable(null),
    sideOffset = 4,
    class: className,
    ...restProps
  }: DropdownMenuPrimitive.ContentProps = $props();
</script>

<DropdownMenuPrimitive.Content
  bind:ref
  {sideOffset}
  class={cn(
    optionContainerStyle,
    className
  )}
  {...restProps}
/>

