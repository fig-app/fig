<script lang="ts">
  import {Slider as SliderPrimitive, type WithoutChildrenOrChild} from "bits-ui";
  import {cn} from "$lib/utils.js";

  type SliderProps = WithoutChildrenOrChild<SliderPrimitive.RootProps> & {
    thumbColor?: string;
    rangeColor?: string;
  }

  let {
    ref = $bindable(null),
    value = $bindable([0]),
    class: className,
    ...restProps
  }: SliderProps = $props();
</script>

<SliderPrimitive.Root
  bind:ref
  bind:value
  class={cn("slider relative flex w-full touch-none select-none items-center", className)}
  {...restProps}
>
  {#snippet children({thumbs})}
		<span
      class="bg-secondary relative h-2 w-full grow overflow-hidden rounded-full slider-color">
			<SliderPrimitive.Range class="absolute h-full slider-range"/>
		</span>
    {#each thumbs as thumb}
      <SliderPrimitive.Thumb
        index={thumb}
        class="slider-thumb border-border ring-offset-background focus-visible:ring-ring block size-5 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      />
    {/each}
  {/snippet}
</SliderPrimitive.Root>

<style>
  :global(.slider) {
    --range-color: hsl(var(--primary));
    --slider-color: hsl(var(--secondary));
    --thumb-color: hsl(var(--foreground));
  }

  .slider-color {
    background: var(--slider-color);
  }

  :global(.slider-range) {
    background: var(--range-color);
  }

  :global(.slider-thumb) {
    background: var(--thumb-color) !important;
  }
</style>