<script lang="ts">
  import {afterUpdate, onMount, setContext, tick} from "svelte";
  import type {CanvasContext} from "./types/CanvasContext";
  import type {CanvasNode} from "./types/CanvasNode";
  import {fillRect} from "$lib/primitive/rect";

  // Exports
  export let width = 100;
  export let height = 100;
  export let fullscreen = false;
  export let pipeline: Set<CanvasNode> = new Set();
  export let backgroundColor = "rgba(30, 30, 30, 1)";

  let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D | null;
  let scheduled = false;

  let windowWidth = 0;
  let windowHeight = 0;
  let resizeTimeout: NodeJS.Timeout;

  onMount(() => {
    ctx = canvas.getContext("2d");
    if (fullscreen) {
      width = windowWidth;
      height = windowHeight;
    }
    drawBackground();
  });

  afterUpdate(async () => {
    if (scheduled) return;

    // await component uptate

    scheduled = true;
    await tick();
    scheduled = false;

    // component is updated
    // so redraw the component
    drawBackground();
  });

  setContext<CanvasContext>("canvas", {
    register,
    unregister
  });

  // Functions
  function register(node: CanvasNode) {
    onMount(() => {
      pipeline.add(node);
      return () => pipeline.delete(node);
    });

    afterUpdate(async () => {
      if (scheduled) return;

      // await component uptate

      scheduled = true;
      await tick();
      scheduled = false;

      // component is updated
      // so redraw the component
      draw();
    });
  }

  function unregister(node: CanvasNode) {
    pipeline.delete(node);
  }

  function draw() {
    drawBackground();
    drawNodes();
  }

  function drawBackground() {
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      fillRect({
        ctx,
        x: width / 2,
        y: height / 2,
        width,
        height,
        color: backgroundColor
      });
    }
  }

  function drawNodes() {
    if (ctx) {
      for (const node of pipeline) {
        node.draw(ctx);
      }
    }
  }

  function handleWindowResize() {
    if (fullscreen) {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = windowWidth;
        height = windowHeight;
        draw();
      }, 100);
    }
  }
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight}
               on:resize={handleWindowResize}/>

<canvas bind:this={canvas} {width} {height}>
    <slot {width} {height}></slot>
</canvas>

