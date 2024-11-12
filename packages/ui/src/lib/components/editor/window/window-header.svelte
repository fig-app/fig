<script lang="ts" module>

  import type {Snippet} from "svelte";
  import type {HTMLAttributes} from "svelte/elements";

  export type HeaderProps = HTMLAttributes<HTMLDivElement> & {
    ref?: HTMLElement;
    children: Snippet;
  }
</script>

<script lang="ts">
  import {Button} from "$lib/components/ui/button";
  import {X} from "lucide-svelte";
  import {cn} from "$lib/utils.js";
  import {getWindowContext} from "$lib/components/editor/window/context";
  import type {ActionReturn} from "svelte/action";

  let {
    ref = $bindable(undefined),
    class: className,
    children,
    ...restProps
  }: HeaderProps = $props();

  let windowContext = getWindowContext();
  let windowRef = $derived(windowContext.windowRef);

  function drag(node: HTMLElement) {
    let moving = false;
    let left = windowContext.left;
    let top = windowContext.top;

    node.addEventListener('mousedown', () => moving = true);

    node.addEventListener('mousemove', (e) => {
      if (moving && windowRef && ref) {
        // console.log(window.innerHeight + window.scrollY, top + e.movementY + windowRef.offsetHeight, top)
        // Check if the window is out of bounds only on the y-axis
        if (top + e.movementY < window.scrollY) return;
        if (top + e.movementY + ref.offsetHeight > window.innerHeight + window.scrollY) return;

        left += e.movementX;
        top += e.movementY;

        windowRef.style.top = `${top}px`;
        windowRef.style.left = `${left}px`;
        windowContext.top = top;
        windowContext.left = left;
      }
    })

    node.addEventListener('mouseup', () => moving = false);
    node.addEventListener('mouseleave', () => moving = false);
  }
</script>

<div
  use:drag
  bind:this={ref}
  class={cn("flex justify-between px-4 py-2 pr-2 select-none", className)}
  {...restProps}>
  {@render children()}

  <Button size="icon-sm" variant="ghost" onclick={windowContext.closeWindow}>
    <X/>
  </Button>
</div>