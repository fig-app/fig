<script lang="ts">
  import {onMount, tick, untrack} from "svelte";
  import type {CanvasNode} from "./types/CanvasNode";
  import {fillRect} from "$lib/primitive/rect";
  import {canvasClick} from "$lib/stores/canvasClick.svelte";
  import {canvasTime} from "$lib/stores/canvasTime.svelte";
  import {keys} from "./stores/keys.svelte";
  import {navigation} from "$lib/stores/navigation.svelte";
  import {setCanvasContext} from "$lib/context/canvasContext";
  import {cursorPosition} from "$lib/stores/cursorPosition.svelte";

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
  // let firstDraw = $state(false);

  let clickTimeout: NodeJS.Timeout;

  const ZOOM_AMOUNT: number = 1.1;

  $inspect(navigation.percentScale);

  updateCanvas(() => [navigation.scale, navigation.offsetX, navigation.offsetY, windowWidth, windowHeight, keys.combo, canvasClick.clickPoint]);

  // Set canvas context
  setCanvasContext({
    register,
    unregister,
    updateCanvas,
    redraw: draw
  });

  onMount(() => {
    ctx = canvas.getContext("2d");

    // Update loop
    function loop(timestamp: number) {
      update(timestamp);
      // draw();
      frameId = requestAnimationFrame(loop);
    }

    frameId = requestAnimationFrame(loop);

    if (fullscreen) {
      width = windowWidth;
      height = windowHeight;
    }

    draw();

    return () => {
      cancelAnimationFrame(frameId);
    }
  });

  // Functions
  function updateCanvas(depts: () => any[]) {
    let scheduled = false;
    $effect(() => {
      depts();
      return untrack(() => {
        if (scheduled) return;
        scheduled = true;
        tick().then(() => {
          console.log("Update canvas")
          scheduled = false;
        });
        return draw();
      });
    });
  }

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

    if (navigation.percentScale > 800) {
      drawGrid();
    }

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

  function drawGrid() {
    if (ctx) {
      ctx.strokeStyle = "rgb(62, 62, 62)";
      ctx.lineWidth = 1;

      ctx.beginPath();

      let cellSize = 1;
      for (
        /* Start the first line based on offsetX and scale */
        let x = (navigation.offsetX % cellSize) * navigation.scale;
        x <= width;
        /* Cell size based on scale amount */
        x += cellSize * navigation.scale
      ) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }

      /* Horizontal lines spanning the full height */
      for (
        /* Start the first line based on offsetY and scale */
        let y = (navigation.offsetY % cellSize) * navigation.scale;
        y <= height;
        /* Cell size based on scale amount */
        y += cellSize * navigation.scale
      ) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }

      ctx.stroke();
    }
  }

  function update(timestamp: number) {
    canvasTime.updateTimestamp(timestamp);
    canvasTime.updateTimers();

    for (const node of pipeline) {
      node.update();
    }
  }

  function updateCursorPosition(e: MouseEvent) {
    cursorPosition.pos = {x: e.clientX, y: e.clientY}
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
    event.preventDefault();
    if (keys.containKey("Control")) {
      handleZoom(event);
    } else {
      handleScroll(event);
    }
  }

  function handleZoom(event: WheelEvent) {
    console.log("Zooming...");
    if (event.deltaY > 0 && navigation.scale >= 0.05) {
      navigation.scale /= ZOOM_AMOUNT;
    } else if (event.deltaY < 0) {
      navigation.scale *= ZOOM_AMOUNT;
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

<canvas onwheel={handleWheel} bind:this={canvas} {width}
        {height}
        onmousemove={updateCursorPosition}
        onclick={(e) => {
    canvasClick.setSingleClick(true, {x: e.clientX, y: e.clientY});

    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
        canvasClick.resetClick()
    }, 100)
}}
        ondblclick={(e) => {
    canvasClick.setDoubleClick(true, {x: e.clientX, y: e.clientY});
}}
        onmousedown={(e) => {
    canvasClick.setPress(true, {x: e.clientX, y: e.clientY})
}}
        onmouseup={(_) => canvasClick.resetClick()}>
  <slot {width} {height}></slot>
</canvas>
