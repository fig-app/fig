<script lang="ts">
  import type {VectorPart} from "$lib/types/VectorPart";
  import {cursorPosition} from "$lib/stores/cursorPosition.svelte";
  import {isCursorHoveringArc} from "@fig/functions/shape/arc";
  import {canvasClick} from "$lib/stores/canvasClick.svelte";
  import {arc} from "$lib/primitive/arc";
  import {useId} from "@fig/functions/id";
  import {getPrimitiveBlue, getPrimitiveWhite} from "@fig/functions/color";
  import type {MLTPathCommand} from "@fig/functions/path/PathCommand";
  import {navigation} from "$lib/stores/navigation.svelte";
  import {getVectorContext, registerVectorPart} from "$lib/context/vectorContext";
  import {getCanvasContext} from "$lib/context/canvasContext";

  type Props = {
    geometryIndex: number;
    pointIndex: number;
  }

  let {geometryIndex, pointIndex}: Props = $props();

  // No need for radius variable, because this will be a const
  const RADIUS_DEFAULT: number = 4;
  const RADIUS_SELECTED: number = 5;
  const PRIMITIVE_BLUE: string = getPrimitiveBlue();
  const PRIMITIVE_WHITE: string = getPrimitiveWhite();

  let hovered = $state(false);
  let clicked = $state(false);
  let dragged = $state(false);

  let canvasContext = getCanvasContext();
  let context = getVectorContext();

  // Register point part
  let part: VectorPart = $state({
    id: useId(),
    type: "point",
    draw,
    update,
    selected: false
  });

  registerVectorPart(part);

  // Point virtualCommand
  let realCommand = $state(context.strokeGeometriesCommands[geometryIndex][pointIndex] as MLTPathCommand);
  let virtualCommand = $state({...realCommand});
  let centerPoint = $derived(virtualCommand.endPoint);

  // Force update when this variables change (trigger the redraw)
  canvasContext.updateCanvas(() => [realCommand, hovered, clicked, part.selected])

  // Debug

  // Update selected state
  $effect(() => {
    if (dragged) {
      context.setDraggedPart(part);

      if (dragged && !part.selected && context.isDragged(part)) {
        part.selected = true;
        context.setSelectedPart(part);
      }
    }
  })

  $effect(() => {
    if (!dragged && !canvasClick.pressed) {
      context.resetDraggedPart(part);
    }
  })

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
    virtualCommand.endPoint = navigation.toVirtualPoint(realCommand.endPoint);

    hovered = isCursorHoveringArc({
      cursorPosition,
      arc: {
        centerPosition: centerPoint,
        radius: RADIUS_DEFAULT + 1,
      }
    });

    clicked = hovered && canvasClick.single;
    dragged = (dragged && canvasClick.pressed) || (hovered && canvasClick.pressed && !context.isDragged(part));

    if (dragged && context.isDragged(part)) {
      let x = (cursorPosition.x - canvasClick.clickPoint.x) / navigation.scale;
      let y = (cursorPosition.y - canvasClick.clickPoint.y) / navigation.scale;
      canvasClick.setClickPoint(cursorPosition.pos);

      realCommand.endPoint.x += x;
      realCommand.endPoint.y += y;
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


