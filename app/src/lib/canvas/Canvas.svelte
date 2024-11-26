<script lang="ts">
  import {getAllContexts, mount, onMount, type Snippet, tick, untrack} from "svelte";
  import type {CanvasNode} from "./types/CanvasNode";
  import {fillRect, rect} from "$lib/canvas/primitive/rect";
  import {canvasClick} from "$lib/canvas/stores/canvasClick.svelte";
  import {canvasTime} from "$lib/canvas/stores/canvasTime.svelte";
  import {cursorPosition, keys} from "$lib/stores";
  import {navigation} from "$lib/canvas/stores/navigation.svelte";
  import {setCanvasContext} from "$lib/canvas/context/canvasContext";
  import {selector} from "$lib/canvas/components/Selector.svelte.js";
  import {
    canvasColors,
    DEFAULT_BACKGROUND_COLOR,
    DEFAULT_GRID_COLOR
  } from "$lib/canvas/stores/canvasColors";
  import type {Vector as VectorType} from "@fig/types/properties/Vector";
  import {canvasPipeline} from "$lib/canvas/stores/canvasPipeline.svelte";
  import {canvasSettings} from "$lib/canvas/stores/canvasSettings.svelte.js";
  import {canvasRenderingContext} from "$lib/canvas/stores/canvasRenderingContext.svelte";
  import {line} from "$lib/canvas/primitive/line";
  import Vector from "$lib/canvas/components/vector/Vector.svelte";

  type Props = {
    width?: number;
    height?: number;
    children: Snippet
  }

  // Exports
  let {
    width = 100,
    height = 100,
    children
  }: Props = $props();

  let pipeline: Set<CanvasNode> = canvasPipeline.pipeline;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = canvasRenderingContext.ctx;
  let frameId: number;

  let windowWidth = $state(0);
  let windowHeight = $state(0);
  let availableWidth = $state(0);
  let availableHeight = $state(0);
  let resizeTimeout: NodeJS.Timeout;
  let drawTimeout: NodeJS.Timeout;

  let clickTimeout: NodeJS.Timeout;
  let isPanning: boolean = false;
  let lastPanningPos: VectorType = {
    x: 0,
    y: 0,
  }

  const ZOOM_AMOUNT: number = 1.15;

  updateCanvas(() => [
    canvasSettings.backgroundColor,
    navigation.scale,
    navigation.offsetX,
    navigation.offsetY,
    windowWidth,
    windowHeight,
    keys.keyPressed,
    canvasClick.clickPoint,
    selector.rect?.width,
    selector.rect?.height,
    availableWidth,
    availableHeight
  ]);

  // Set canvas context
  setCanvasContext({
    register,
    unregister,
    updateCanvas,
    redraw: draw
  });

  onMount(() => {
    ctx = canvas.getContext("2d");
    canvasRenderingContext.ctx = canvas.getContext("2d");

    // Update loop
    function loop(timestamp: number) {
      update(timestamp);
      frameId = requestAnimationFrame(loop);
    }

    frameId = requestAnimationFrame(loop);

    width = availableWidth;
    height = availableHeight;

    setTimeout(() => {
      draw();
    }, 100)

    return () => {
      cancelAnimationFrame(frameId);
    }
  });

  const contexts = getAllContexts();

  $effect(() => {
    if (canvasPipeline.creationPipeline.length > 0) {
      for (let node of canvasPipeline.creationPipeline) {
        mount(Vector, {
          target: document.querySelector("#canvas") as HTMLElement,
          props: {node},
          context: contexts,
        });
      }

      canvasPipeline.clearCreationPipeline();
    }
  })

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

    if (ctx) {
      selector.draw(ctx);
      drawLineIndicators(ctx);
    }
  }

  function drawLineIndicators(ctx: CanvasRenderingContext2D) {
    if (!selector.selectedNode) {
      return;
    }

    let selectedNode = selector.selectedNode;
    // right side
    if (navigation.toVirtualX(selectedNode.position.x) > canvas.width) {
      line({
        ctx,
        start: {
          x: canvas.width,
          y: navigation.toVirtualY(selectedNode.position.y),
        },
        end: {
          x: canvas.width,
          y: navigation.toVirtualY(selectedNode.position.y) + selectedNode.boundingBox.height
        },
        color: canvasColors.white,
      });
    }
    // left side
    else if (navigation.toVirtualX(selectedNode.position.x + selectedNode.boundingBox.width) < 0) {
      line({
        ctx,
        start: {
          x: 20,
          y: navigation.toVirtualY(selectedNode.position.y),
        },
        end: {
          x: 20,
          y: navigation.toVirtualY(selectedNode.position.y) + selectedNode.boundingBox.height
        },
        color: canvasColors.white,
      });
    }
    // top side
    if (navigation.toVirtualY(selectedNode.position.y) < 0) {
      line({
        ctx,
        start: {
          x: navigation.toVirtualX(selectedNode.position.x),
          y: 20,
        },
        end: {
          x: navigation.toVirtualX(selectedNode.position.x) + selectedNode.boundingBox.width,
          y: 20,
        },
        color: canvasColors.white,
      })
    }
    // bottom side
    else if (navigation.toVirtualY(selectedNode.position.y + selectedNode.boundingBox.height) > canvas.height) {
      line({
        ctx,
        start: {
          x: navigation.toVirtualX(selectedNode.position.x),
          y: canvas.height,
        },
        end: {
          x: navigation.toVirtualX(selectedNode.position.x) + selectedNode.boundingBox.width,
          y: canvas.height,
        },
        color: canvasColors.white,
      })
    }

    drawRulers();
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
        color: canvasSettings.backgroundColor
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
      ctx.strokeStyle = DEFAULT_GRID_COLOR;
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

  // Draw rulers with pixel values on the sides of the canvas (top and left)
  function drawRulers() {
    if (ctx) {
      ctx.fillStyle = canvasColors.darkGray1;
      ctx.fillRect(0, 0, width, 20);
      ctx.fillRect(0, 0, 20, height);

      // If selected node draw bounding box
      if (selector.selectedNode) {
        const selectedNode = selector.selectedNode;
        const boundingBox = selectedNode.boundingBox;
        const topLeft = boundingBox.topLeft;
        const bottomRight = boundingBox.corners[2];

        ctx.fillStyle = "rgba(12, 140, 233, .4)";
        ctx.fillRect(topLeft.x, 0, (navigation.toRealX(bottomRight.x) - navigation.toRealX(topLeft.x)) * navigation.scale, 20);
        ctx.fillRect(0, topLeft.y, 20, (navigation.toRealY(bottomRight.y) - navigation.toRealY(topLeft.y)) * navigation.scale);
      }

      // Calculate cell size based on scale
      let cellSize = 0;
      if (navigation.percentScale < 5) {
        cellSize = 5000;
      } else if (navigation.percentScale < 5) {
        cellSize = 2500;
      } else if (navigation.percentScale < 10) {
        cellSize = 1000;
      } else if (navigation.percentScale < 25) {
        cellSize = 500;
      } else if (navigation.percentScale < 50) {
        cellSize = 250;
      }

      if (navigation.percentScale > 5000) {
        cellSize = 1;
      } else if (navigation.percentScale > 3000) {
        cellSize = 2;
      } else if (navigation.percentScale > 1000) {
        cellSize = 5;
      } else if (navigation.percentScale > 500) {
        cellSize = 10;
      } else if (navigation.percentScale > 200) {
        cellSize = 50;
      } else if (navigation.percentScale > 50) {
        cellSize = 100;
      }

      // Draw pixel values
      ctx.font = "11px Arial";
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (
        let x = (navigation.offsetX % cellSize) * navigation.scale;
        x <= width;
        x += cellSize * navigation.scale
      ) {
        ctx.fillText(navigation.toRealX(x).toFixed(0).toString(), x, 10);
        line({ctx, start: {x, y: 16}, end: {x, y: 20}, color: canvasColors.darkGray2})
      }

      for (
        let y = (navigation.offsetY % cellSize) * navigation.scale;
        y <= height;
        y += cellSize * navigation.scale
      ) {
        ctx.save()
        ctx.textAlign = "center"

        ctx.translate(11, y);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(navigation.toRealY(y).toFixed(0).toString(), 0, 0);
        ctx.restore();

        line({ctx, start: {x: 16, y}, end: {x: 20, y}, color: canvasColors.darkGray2})
      }

      // Draw borders and top left corner
      rect({
        ctx,
        x: 0,
        y: 0,
        width: 40,
        height: 40,
        colors: {
          background: canvasColors.darkGray1
        },
      });

      line({
        ctx,
        start: {x: 0, y: 20},
        end: {x: width, y: 20},
        color: canvasColors.darkGray2,
        weight: 1,
      });

      line({
        ctx,
        start: {x: 20, y: 0},
        end: {x: 20, y: height},
        color: canvasColors.darkGray2,
        weight: 1,
      });
    }
  }

  function update(timestamp: number) {
    canvasTime.updateTimestamp(timestamp);
    canvasTime.updateTimers();

    selector.update();

    for (const node of pipeline) {
      node.update();
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (isPanning) {
      // move delta between last post and current pos
      let delta: VectorType = {
        x: e.x - lastPanningPos.x,
        y: e.y - lastPanningPos.y,
      }
      navigation.offsetX += delta.x / navigation.scale;
      navigation.offsetY += delta.y / navigation.scale;

      // For next move
      lastPanningPos = {
        x: e.x,
        y: e.y,
      }
    }
  }

  function handleResize() {
    console.log("resize");

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = availableWidth;
      height = availableHeight;

      console.log(`Resizing canvas to ${width}x${height}`);
    }, 100);

    clearTimeout(drawTimeout);
    drawTimeout = setTimeout(() => {
      draw();
    }, 100);
  }

  function handleWheel(event: WheelEvent) {
    event.preventDefault();
    if (keys.ctrlPressed()) {
      handleZoom(event);
    } else {
      handleScroll(event);
    }
  }

  function handleZoom(event: WheelEvent) {
    let oldScale = navigation.scale;
    // zooming considering the position of the cursor
    if (event.deltaY > 0) {
      navigation.scale /= ZOOM_AMOUNT;
    } else if (event.deltaY < 0 && navigation.scale <= 525) {
      navigation.scale *= ZOOM_AMOUNT;
    }
    let zoomRatio = (navigation.scale / oldScale);

    // positive if zoomed, negative if de-zoomed, hence the 1
    const scaleAmount = 1 - zoomRatio;

    const zoomRatioX = cursorPosition.offsetX / canvas.clientWidth;
    const zoomRatioY = cursorPosition.offsetY / canvas.clientHeight;

    // Amount zoomed from each edge of the screen
    const unitsZoomedX = (canvas.width / navigation.scale) * scaleAmount;
    const unitsZoomedY = (canvas.height / navigation.scale) * scaleAmount;

    const unitsAddLeft = unitsZoomedX * zoomRatioX;
    const unitsAddTop = unitsZoomedY * zoomRatioY;

    navigation.offsetX += unitsAddLeft;
    navigation.offsetY += unitsAddTop;
  }

  function handleScroll(event: WheelEvent) {
    // Pan = Absolute distance to move (raw amount of scroll)
    let panX = event.deltaX;
    let panY = event.deltaY;
    // Update offsets for virtual coordinates (check out for scale)
    navigation.offsetX -= panX / navigation.scale;
    navigation.offsetY -= (panY / navigation.scale) / 2;
  }

  function handleCanvasClick(event: MouseEvent) {
    // Do not consider click if in selection with the selector rectangle
    if (!selector.rect) {
      canvasClick.setSingleClick(true, {x: event.offsetX, y: event.offsetY});
    }

    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
      canvasClick.resetClick()
    }, 100)

    // IN WORK !!! (but do better selector first)
    // Add new vector when clicking on canvas
    // If nothing is actually selected
    // And if in pen mode
    if (canvasSettings.mode === 'PEN' && !selector.hasSelectedParts()) {
    } else {
    }
  }

</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight}
               onresize={handleResize}/>

<div class="h-full" bind:clientWidth={availableWidth} bind:clientHeight={availableHeight}>
  <canvas bind:this={canvas}
          {width}
          {height}
          style:width={width + "px"}
          style:height={height + "px"}
          onwheel={handleWheel}
          onmousemove={handleMouseMove}
          onclick={handleCanvasClick}
          ondblclick={(e: MouseEvent) => {
            if (e.button === 0) {
              canvasClick.setDoubleClick(true, {x: e.clientX, y: e.clientY});
            }
          }}
          onmousedown={(e: MouseEvent) => {
            // Left click
            if (e.button === 0) {
              canvasClick.setPress(true, {x: e.clientX, y: e.clientY});
            }
            // Middle click -> panning
            else if (e.button === 1) {
              isPanning = true;
              lastPanningPos = {x: e.x, y: e.y};
              canvas.style.cursor = 'grabbing';
            }
          }}
          onmouseup={(e: MouseEvent) => {
            canvasClick.resetClick();
            if (e.button === 1) {
              isPanning = false;
              canvas.style.cursor = "default";
            }
          }}
          onmouseleave={(_) => {
            isPanning = false;
            canvas.style.cursor = "default";
          }}
  >
    {@render children()}
  </canvas>
</div>

<div id="canvas"></div>