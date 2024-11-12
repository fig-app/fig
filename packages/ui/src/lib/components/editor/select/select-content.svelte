<script lang="ts">
  import {Select as SelectPrimitive, type WithoutChild} from "bits-ui";
  import SelectScrollUpButton from "./select-scroll-up-button.svelte";
  import SelectScrollDownButton from "./select-scroll-down-button.svelte";
  import {cn} from "$lib/utils";
  import {OptionContainer} from "$lib/components/editor/options";

  let {
    ref = $bindable(null),
    class: className,
    sideOffset = 4,
    children,
    ...restProps
  }: WithoutChild<SelectPrimitive.ContentProps> = $props();
</script>

<SelectPrimitive.Portal>
  <SelectPrimitive.Content
    bind:ref
    {sideOffset}
    class={cn(
			className
		)}
    {...restProps}
  >
    <OptionContainer>
      <SelectScrollUpButton/>
      <SelectPrimitive.Viewport
        class={cn(
				"h-fit w-full min-w-[var(--bits-select-anchor-width)]"
			)}
      >
        {@render children?.()}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton/>
    </OptionContainer>
  </SelectPrimitive.Content>
</SelectPrimitive.Portal>
