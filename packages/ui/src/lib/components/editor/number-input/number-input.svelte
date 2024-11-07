<script lang="ts" module>
  import type {Snippet} from "svelte";
  import type {HTMLInputAttributes} from "svelte/elements";
  import type {WithElementRef} from "bits-ui";

  export const partStyle = "cursor-col-resize";

  export type NumberInputProps = WithElementRef<HTMLInputAttributes> & {
    suffix?: string;
    left?: Snippet;
    right?: Snippet;
    children: Snippet
  }
</script>

<script lang="ts">
  import {Input} from "$lib/components/ui/input/index.js";
  import {Portal} from "bits-ui";
  import {MoveHorizontal} from "lucide-svelte";

  let {
    ref = $bindable(undefined),
    class: className,
    value = $bindable(0),
    suffix,
    left: leftPart,
    right: rightPart,
    min,
    max,
    children,
    ...restProps
  }: NumberInputProps = $props();

  let canUpdateValue = $state(false);

  function horizontalDrag(node: HTMLDivElement) {
    let direction = 0;

    node.addEventListener("mousedown", () => canUpdateValue = true);

    window.addEventListener("mousemove", (e) => {
      if (canUpdateValue) {
        window.document.body.requestPointerLock();

        direction = Math.sign(e.movementX);

        if (direction !== 0 && value + direction >= min && value + direction <= max) {
          value += direction;
        }
      }
    })

    window.addEventListener("mouseup", () => {
      canUpdateValue = false;
      window.document.exitPointerLock();
    });
  }

  $effect(() => {
    if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }
  })

</script>

<Input bind:this={ref} type="number" bind:value={value} class={className} {...restProps}
       onfocus={(e) => e.target.select()}>
  {#snippet left()}
    {#if (leftPart)}
      <button use:horizontalDrag class={partStyle}>
        {@render leftPart()}
      </button>
    {/if}
  {/snippet}

  {#snippet right()}
    {#if (rightPart)}
      <button use:horizontalDrag class={partStyle}>
        {@render rightPart()}
      </button>
    {/if}
  {/snippet}
</Input>
