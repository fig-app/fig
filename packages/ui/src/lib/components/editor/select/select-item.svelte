<script lang="ts">
  import Check from "lucide-svelte/icons/check";
  import {Select as SelectPrimitive, type WithoutChild} from "bits-ui";
  import {optionStyle} from "$lib/components/editor/options";
  import {cn} from "$lib/utils.js";

  let {
    ref = $bindable(null),
    class: className,
    value,
    label,
    children: childrenProp,
    ...restProps
  }: WithoutChild<SelectPrimitive.ItemProps> = $props();
</script>

<SelectPrimitive.Item
  bind:ref
  {value}
  class={cn(
    optionStyle,
		"data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground rounded-sm pl-7 pr-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
		className
	)}
  {...restProps}
>
  {#snippet children({selected, highlighted})}
    {#if selected}
      <Check class="size-4 left-2"/>
    {/if}
    {#if childrenProp}
      {@render childrenProp({selected, highlighted})}
    {:else}
      {label || value}
    {/if}
  {/snippet}
</SelectPrimitive.Item>
