<script lang="ts">
  import {
    DropdownMenu as DropdownMenuPrimitive,
    type WithoutChild
  } from "bits-ui";
  import Check from "lucide-svelte/icons/check";
  import Minus from "lucide-svelte/icons/minus";
  import {optionStyle} from "$lib/components/editor/options/index.js";
  import {cn} from "$lib/utils.js";

  let {
    ref = $bindable(null),
    checked = $bindable(false),
    class: className,
    children: childrenProp,
    ...restProps
  }: WithoutChild<DropdownMenuPrimitive.CheckboxItemProps> = $props();
</script>

<DropdownMenuPrimitive.CheckboxItem
  bind:ref
  bind:checked
  class={cn(
    optionStyle,
		className
	)}
  {...restProps}
>
  {#snippet children({checked})}
    {#if checked === "indeterminate"}
      <Minus class="size-4"/>
    {:else}
      <Check class={cn("size-4", !checked && "text-transparent")}/>
    {/if}
    {@render childrenProp?.({checked})}
  {/snippet}
</DropdownMenuPrimitive.CheckboxItem>
