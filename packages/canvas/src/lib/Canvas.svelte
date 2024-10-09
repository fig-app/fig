<script lang="ts">
  import {onMount} from "svelte";
  import type {CanvasNode} from "./types/CanvasNode";
  import {fillRect} from "$lib/primitive/rect";
  import {cursorPosition} from "$lib/stores/cursorPosition.svelte";
  import {canvasClick} from "$lib/stores/canvasClick.svelte";
  import {canvasTime} from "$lib/stores/canvasTime.svelte";
  import {keys} from "./stores/keys.svelte";
  import {navigation} from "$lib/stores/navigation";
  import {setCanvasContext} from "$lib/context/canvasContext";

  type Props = {
    width: number;
    height: number;
    fullscreen: boolean;
    backgroundColor: string;
  }

  // Exports
  let {
    width = 100,
    height = 100,
    fullscreen = false,
    backgroundColor = "rgba(30, 30, 30, 1)"
  }: Props = $props();

  let pipeline: Set<CanvasNode> = $state(new Set());

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let frameId: number;

  let windowWidth = $state(0);
  let windowHeight = $state(0);
  let resizeTimeout: NodeJS.Timeout;

  let clickTimeout: NodeJS.Timeout;

  const ZOOM_AMOUNT: number = .2;

  // Set canvas context
  setCanvasContext({
    register,
    unregister,
    redraw: draw
  });

  onMount(() => {
    ctx = canvas.getContext("2d");

    // Update loop
    function loop(timestamp: number) {
      update(timestamp);
      draw();
      frameId = requestAnimationFrame(loop);
    }

    frameId = requestAnimationFrame(loop);

    if (fullscreen) {
      width = windowWidth;
      height = windowHeight;
    }
    drawBackground();

    return () => {
      cancelAnimationFrame(frameId);
    }
  });

  // Functions
  function register(node: CanvasNode) {
    onMount(() => {
      pipeline.add(node);
      return () => pipeline.delete(node);
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

  function update(timestamp: number) {
    canvasTime.updateTimestamp(timestamp);
    canvasTime.updateTimers();

    for (const node of pipeline) {
      node.update();
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

  function handleWheel(event: WheelEvent) {
    if (keys.containKey("Control")) {
      handleZoom(event);
    } else {
      handleScroll(event);
    }
  }

  function handleZoom(event: WheelEvent) {
    if (navigation.scale > 0) {
      navigation.scale += event.deltaY / 100 / navigation.scale;
    }
  }

  function handleScroll(event: WheelEvent) {
    console.log("Scrolling...");
    // Pan = Absolute distance to move (raw amount of scroll)
    let panX = event.deltaX;
    let panY = event.deltaY;
    // Update offsets for virtual coordinates (check out for scale)
    navigation.offsetX -= panX / navigation.scale;
    navigation.offsetY -= (panY / navigation.scale) / 2;
  }

</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight}
               on:resize={handleWindowResize}/>

<canvas on:wheel|preventDefault={handleWheel} bind:this={canvas} {width}
        {height}
        on:mousemove|preventDefault={(e) => cursorPosition.pos = {x: e.clientX, y: e.clientY}}
        on:click={(e) => {
    canvasClick.setSingleClick(true, {x: e.clientX, y: e.clientY});

    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
        canvasClick.resetClick()
    }, 100)
}}
        on:dblclick={(e) => {
    canvasClick.setDoubleClick(true, {x: e.clientX, y: e.clientY});
}}
        on:mousedown={(e) => {
    canvasClick.setPress(true, {x: e.clientX, y: e.clientY})
}}
        on:mouseup={(_) => canvasClick.resetClick()}>
  <slot {width} {height}></slot>
</canvas>
