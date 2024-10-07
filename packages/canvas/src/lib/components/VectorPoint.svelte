<script lang="ts">
  import {getContext, onDestroy} from "svelte";
  import type {VectorContext} from "$lib/types/VectorContext";
  import type {VectorPart} from "$lib/types/VectorPart";
  import {cursorPosition} from "$lib/stores/cursorPosition";
  import {isCursorHoveringArc} from "@fig/functions/shape/arc";
  import {canvasClick} from "$lib/stores/canvasClick";
  import {arc} from "$lib/primitive/arc";
  import {useId} from "@fig/functions/id";
  import {getPrimitiveBlue, getPrimitiveWhite} from "@fig/functions/color";
  import type {MLTPathCommand} from "@fig/functions/path/PathCommand";

  export let geometryIndex: number;
  export let pointIndex: number;
  export let isBuilt: boolean = true;

  // No need for radius variable, because this will be a const
  const RADIUS_DEFAULT: number = 4;
  const RADIUS_SELECTED: number = 5;
  const PRIMITIVE_BLUE: string = getPrimitiveBlue();
  const PRIMITIVE_WHITE: string = getPrimitiveWhite();

  let hovered = false;
  let clicked = false;
  let dragged = false;

  // Register and unregister part
  let part: VectorPart = {
    id: useId(),
    type: "point",
    draw,
    update,
    selected: false
  };

  let context = getContext<VectorContext>("vector");
  context.register(part);
  onDestroy(() => {
    context.unregister(part);
  })

  // Point command
  let command = context.stroke_geometries_commands[geometryIndex][pointIndex] as MLTPathCommand;
  let centerPoint = command.endPoint;

  // Force update when this variables change (trigger the redraw)
  $: command || hovered || clicked;

  // Debug

  // Update selected state
  $: dragged && (() => {
    context.setDraggedPart(part);

    if (dragged && !part.selected && context.isDragged(part)) {
      part.selected = true;
      context.setSelectedPart(part);
    }
  })();

  $: !dragged && !canvasClick.pressed && (() => {
    context.resetDraggedPart(part);
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
    hovered = isCursorHoveringArc({
      cursorPosition,
      arc: {
        centerPosition: centerPoint,
        radius: RADIUS_DEFAULT + 1,
      }
    });

    clicked = hovered && canvasClick.single;
    dragged = dragged && canvasClick.pressed || hovered && canvasClick.pressed && !context.isDragged(part);

    if (dragged && context.isDragged(part)) {
      let x = cursorPosition.x - canvasClick.clickPoint.x;
      let y = cursorPosition.y - canvasClick.clickPoint.y;
      canvasClick.setClickPoint(cursorPosition.pos)

      command.endPoint.x += x;
      command.endPoint.y += y;
    }
  }

  // Draw functions
  function drawDefault(ctx: CanvasRenderingContext2D) {
    arc({
      ctx,
      x: centerPoint.x,
      y: centerPoint.y,
      radius: RADIUS_DEFAULT,
    });
  }

  function drawHovered(ctx: CanvasRenderingContext2D) {
    arc({
      ctx,
      x: centerPoint.x,
      y: centerPoint.y,
      radius: RADIUS_DEFAULT,
      colors: {
        background: PRIMITIVE_WHITE,
        stroke: PRIMITIVE_WHITE,
      }
    });
  }

  function drawSelected(ctx: CanvasRenderingContext2D) {
    arc({
      ctx,
      x: centerPoint.x,
      y: centerPoint.y,
      radius: RADIUS_SELECTED,
      colors: {
        background: PRIMITIVE_BLUE,
        stroke: PRIMITIVE_WHITE,
      },
    });
  }

</script>


