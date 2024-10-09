<script lang="ts">
  import type {Rect} from "$lib/Rect.svelte";
  import {EditRect} from "$lib/components/EditRect.svelte";
  import {onMount} from "svelte";

  type Props = {
    rect: Rect,
  }

  let {rect}: Props = $props();

  let corners: EditRect[] = $state([]);

  onMount(() => {
    for (const corner of rect.corners) {
      corners.push(new EditRect(corner))
    }
  })

  export function draw(ctx: CanvasRenderingContext2D) {
    for (const corner of corners) {
      corner.draw(ctx);
    }
  }

  export function update() {

  }

</script>


