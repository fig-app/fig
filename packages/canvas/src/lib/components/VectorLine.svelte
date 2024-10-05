<script lang="ts">
  import {getContext, onDestroy} from "svelte";
  import type {VectorContext} from "$lib/types/VectorContext";
  import type {VectorPart} from "$lib/types/VectorPart";
  import {line} from "$lib/primitive/line";
  import type {MLTPathCommand} from "@fig/functions/path/PathCommand";
  import {centerOfSegment, hoverLine} from "@fig/functions/shape/line";
  import {cursorPosition} from "$lib/stores/cursorPosition";
  import {canvasClick} from "$lib/stores/canvasClick";
  import {arc} from "$lib/primitive/arc";
  import {useId} from "@fig/functions/id";

  export let geometryIndex: number;
  export let startIndex: number;
  export let endIndex: number;

  let hovered = false;
  let clicked = false;
  let dragged = false;

  // Register and unregister part
  let part: VectorPart = {
    id: useId(),
    type: "line",
    draw,
    update,
    selected: false
  };

  let context = getContext<VectorContext>("vector");
  context.register(part);
  onDestroy(() => {
    context.unregister(part);
  })

  // Line commands
  let startCommand = context.geometries_commands[geometryIndex][startIndex] as MLTPathCommand;
  let endCommand = context.geometries_commands[geometryIndex][endIndex] as MLTPathCommand;

  let center = centerOfSegment({
    start: startCommand.endPoint,
    end: endCommand.endPoint
  });

  // Force update when this variables change (trigger the redraw)
  $: startCommand || endCommand || hovered || clicked;

  // Debug
  console.log("Geometry", geometryIndex, "Line", startIndex, endIndex, "Commands:", startCommand, endCommand)
  // $: console.log("hovered", hovered, "clicked", clicked, "selected", part.selected);
  // $: console.log(part.id, context.isDragged(part), part.selected)

  // Update selected state
  $: dragged && (() => {
    context.setDraggedPart(part);

    if (dragged && !part.selected && context.isDragged(part)) {
      part.selected = true;
      context.setSelectedPart(part);
    }
  })();

  $: !dragged && !canvasClick.pressed && (() => {
    context.setDraggedPart(null, part);
  })();

  // Functions
  function draw(ctx: CanvasRenderingContext2D) {
    if (dragged && context.isDragged(part)) {
      drawSelected(ctx);
    } else if (hovered && part.selected) {
      drawHovered(ctx);
    } else if (part.selected) {
      drawSelected(ctx);
    } else if (hovered && context.isDragged(part) === null) {
      if (clicked) {
        drawSelected(ctx);
      } else {
        drawHovered(ctx);
      }
    } else {
      drawDefault(ctx);
    }
  }

  function update() {
    hovered = hoverLine({
      line: {
        start: startCommand.endPoint,
        end: endCommand.endPoint
      }, cursorPosition
    });
    clicked = hovered && canvasClick.single;
    dragged = dragged && canvasClick.pressed || hovered && canvasClick.pressed && !context.isDragged(part);

    center = centerOfSegment({
      start: startCommand.endPoint,
      end: endCommand.endPoint
    });

    if (dragged && context.isDragged(part)) {
      let x = cursorPosition.x - canvasClick.clickPoint.x;
      let y = cursorPosition.y - canvasClick.clickPoint.y;
      canvasClick.setClickPoint(cursorPosition.pos)

      startCommand.endPoint.x += x;
      startCommand.endPoint.y += y;

      endCommand.endPoint.x += x;
      endCommand.endPoint.y += y;
    }
  }

  // Draw functions
  function drawDefault(ctx: CanvasRenderingContext2D) {
    line({
      ctx,
      start: startCommand.endPoint,
      end: endCommand.endPoint,
    });
  }

  function drawHovered(ctx: CanvasRenderingContext2D) {
    line({
      ctx,
      start: startCommand.endPoint,
      end: endCommand.endPoint,
      weight: 2
    });

    // center of line
    arc({
      ctx,
      x: center.x / 2,
      y: center.y / 2,
      colors: {background: "#fff", stroke: "rgb(12, 140, 233)"},
      radius: 4,
      strokeWeight: 1
    });
  }

  function drawSelected(ctx: CanvasRenderingContext2D) {
    line({
      ctx,
      start: startCommand.endPoint,
      end: endCommand.endPoint,
      color: "rgb(12, 140, 233)",
      weight: 2
    });
  }

</script>


