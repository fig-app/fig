<script lang="ts">
  import {Tooltip as TooltipPrimitive} from "bits-ui";
  import {cn} from "$lib/utils.js";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: TooltipPrimitive.ContentProps = $props();
</script>

<TooltipPrimitive.Arrow
  bind:ref
  class={cn(
		className,
    "text-border"
	)}
  {...restProps}/>