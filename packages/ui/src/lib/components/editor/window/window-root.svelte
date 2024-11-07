<script lang="ts" module>
  import type {Snippet} from "svelte";
  import type {HTMLAttributes} from "svelte/elements";
  import type {WithElementRef} from "bits-ui";

  export type WindowProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    minWidth?: number;
    minHeight?: number;
    top?: number;
    left?: number;
    show?: boolean;
    closeWhenClickOutside?: boolean;
    children: Snippet;
  }

</script>

<script lang="ts">
  import {Portal} from "bits-ui";
  import {cn} from "$lib/utils.js";
  import {
    getWindowContext,
    setWindowContext
  } from "$lib/components/editor/window/context.js";

  let {
    ref = $bindable(undefined),
    class: className,
    minWidth = 400,
    minHeight = 400,
    top = 0,
    left = 0,
    show = $bindable(false),
    closeWhenClickOutside = true,
    children,
    ...restProps
  }: WindowProps = $props();

  let canClose = $state(false);

  // Set window context
  let initialWindowContext = $state({top, left, windowRef: ref, closeWindow});
  setWindowContext(initialWindowContext);

  // Get window context
  let windowContext = $state(getWindowContext());

  // Update window context
  $effect(() => {
    windowContext.top = top;
    windowContext.left = left;
  });

  // Update canClose state
  $effect(() => {
    if (show && ref) {
      ref.style.top = `${top}px`;
      ref.style.left = `${left}px`;
      setTimeout(() => {
        canClose = true;
      }, 100);
    } else {
      canClose = false;
    }
  });

  // Function that is used to close the window when clicking outside
  function handleClickOutside(event: MouseEvent) {
    if (closeWhenClickOutside && canClose && ref && !ref.contains(event.target as Node)) {
      closeWindow();
    }
  }

  function closeWindow() {
    show = false;
  }

</script>

<svelte:window on:click={handleClickOutside}/>

<Portal>
  {#if (show)}
    <div
      bind:this={ref}
      bind:this={windowContext.windowRef}
      class={cn(
        "absolute z-40 bg-background border border-border rounded-[12px] divide-y divide-border shadow-xl",
        className
      )}
      style:min-width={minWidth + "px"}
      style:min-height={minHeight + "px"}
      {...restProps}>
      {@render children()}
    </div>
  {/if}
</Portal>
