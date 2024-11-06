<script lang="ts">
  import {Tabs as TabsPrimitive} from "bits-ui";
  import {cn} from "$lib/utils.js";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: TabsPrimitive.TriggerProps = $props();
</script>

<TabsPrimitive.Trigger
  bind:ref
  class={cn(
		"bg-background text-foreground/80 text-xs outline-none data-[state=active]:bg-input hover:bg-input data-[state=active]:text-foreground flex items-center justify-center whitespace-nowrap rounded-sm px-2 py-1.5 data-[state=active]:font-semibold transition-all disabled:pointer-events-none disabled:opacity-50",
		className
	)}
  {...restProps}
/>
