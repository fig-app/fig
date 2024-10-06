<script lang="ts">
  import {afterUpdate, onMount, setContext, tick} from "svelte";
  import type {CanvasContext} from "./types/CanvasContext";
  import type {CanvasNode} from "./types/CanvasNode";
  import {fillRect} from "$lib/primitive/rect";
  import {cursorPosition} from "$lib/stores/cursorPosition";
  import {canvasClick} from "$lib/stores/canvasClick";

  // Exports
  export let width = 100;
  export let height = 100;
  export let fullscreen = false;
  export let pipeline: Set<CanvasNode> = new Set();
  export let backgroundColor = "rgba(30, 30, 30, 1)";

  let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D | null;
  let scheduled = false;
  let frameId: number;

  let windowWidth = 0;
  let windowHeight = 0;
  let resizeTimeout: NodeJS.Timeout;

  let clickTimeout: NodeJS.Timeout;

  onMount(() => {
    ctx = canvas.getContext("2d");

    // Update loop
    function loop() {
      update();
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

  afterUpdate(async () => {
    if (scheduled) return;

    // await canvas update

    scheduled = true;
    await tick();
    scheduled = false;

    // canvas is updated
    // so redraw the canvas background
    draw();
  });

  setContext<CanvasContext>("canvas", {
    register,
    unregister,
    redraw: draw
  });

  // Functions
  function register(node: CanvasNode) {
    onMount(() => {
      pipeline.add(node);
      return () => pipeline.delete(node);
    });

    // This function is not in 'register' anymore to avoid the repetition of calls to afterUpdate
    afterUpdate(async () => {
      if (scheduled) return;

      // await component update
      scheduled = true;
      await tick();
      scheduled = false;

      console.log("Update")

      // component is updated
      // so redraw the component
      draw();
    });
  }

  function unregister(node: CanvasNode) {
    pipeline.delete(node);
  }

  function draw() {
    console.log("Redrawing...");
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

  // function drawNode(nodeId: number) {
  //   if (ctx) {
  //     let node = Array.from(pipeline).at(nodeId);
  //     if (node) {
  //       node.draw(ctx);
  //     }
  //   }
  // }

  function update() {
    // console.log("Combo", keys.combo);
    // console.log(cursorPosition.pos)
    // console.log("Single", canvasClick.single, "Pressed", canvasClick.pressed)
    // console.log("Double", canvasClick.double)
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
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight}
               on:resize={handleWindowResize}/>

<canvas bind:this={canvas} {width} {height}
        on:mousemove|preventDefault={(e) => cursorPosition.setPos({x: e.clientX, y: e.clientY})}
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

