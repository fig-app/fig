<script lang="ts">
  import {DropdownMenu as DropdownMenuPrimitive, type WithoutChild} from "bits-ui";
  import Circle from "lucide-svelte/icons/circle";
  import {cn} from "$lib/utils.js";
  import {optionStyle} from "$lib/components/editor/options";

  let {
    ref = $bindable(null),
    class: className,
    children: childrenProp,
    ...restProps
  }: WithoutChild<DropdownMenuPrimitive.RadioItemProps> = $props();
</script>

<DropdownMenuPrimitive.RadioItem
  bind:ref
  class={cn(
    optionStyle,
		className
	)}
  {...restProps}
>
  {#snippet children({checked})}
    {#if checked}
      <Circle class="!size-2 fill-current"/>
    {/if}
    {@render childrenProp?.({checked})}
  {/snippet}
</DropdownMenuPrimitive.RadioItem>
