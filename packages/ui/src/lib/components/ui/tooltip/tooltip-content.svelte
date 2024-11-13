<script lang="ts">
  import {Tooltip as TooltipPrimitive} from "bits-ui";
  import {cn} from "$lib/utils.js";
  import {TooltipArrow} from "$lib/components/ui/tooltip";

  let {
    ref = $bindable(null),
    class: className,
    sideOffset = 4,
    children,
    ...restProps
  }: TooltipPrimitive.ContentProps = $props();
</script>

<TooltipPrimitive.Content
  bind:ref
  {sideOffset}
  class={cn(
		"bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md border px-2 py-1 text-xs",
		className
	)}
  {...restProps}
>
  <TooltipArrow/>
  {@render children?.()}
</TooltipPrimitive.Content>
