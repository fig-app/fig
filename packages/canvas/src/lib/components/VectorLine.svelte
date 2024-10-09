<script lang="ts">
  import type {VectorPart} from "$lib/types/VectorPart";
  import {line} from "$lib/primitive/line";
  import type {MLTPathCommand} from "@fig/functions/path/PathCommand";
  import {centerOfSegment, hoverLine} from "@fig/functions/shape/line";
  import {cursorPosition} from "$lib/stores/cursorPosition.svelte";
  import {canvasClick} from "$lib/stores/canvasClick.svelte";
  import {useId} from "@fig/functions/id";
  import {keys} from "../stores/keys.svelte";
  import {Timer} from "$lib/stores/canvasTime.svelte";
  import {EditPointSvelte} from "$lib/components/EditPoint.svelte";
  import {navigation} from "$lib/stores/navigation";
  import {
    getVectorContext,
    registerVectorPart
  } from "$lib/context/vectorContext";

  type Props = {
    geometryIndex: number;
    startIndex: number;
    endIndex: number;
  }

  let {geometryIndex, startIndex, endIndex}: Props = $props();

  let hovered = $state(false);
  let clicked = $state(false);
  let dragged = $state(false);

  let centerPoint = new EditPointSvelte();

  let keyTimer = new Timer(100, "Repeating");

  let context = getVectorContext();

  // Register line part
  let part: VectorPart = {
    id: useId(),
    type: "line",
    draw,
    update,
    selected: false
  };

  registerVectorPart(part);

  // Line commands
  let realStartCommand = context.strokeGeometriesCommands[geometryIndex][startIndex] as MLTPathCommand;
  let realEndCommand = context.strokeGeometriesCommands[geometryIndex][endIndex] as MLTPathCommand;
  let virtualStartCommand = {...realStartCommand};
  let virtualEndCommand = {...realEndCommand};

  let center = centerOfSegment({
    start: virtualStartCommand.endPoint,
    end: virtualEndCommand.endPoint
  });

  // Force update when this variables change (trigger the redraw)
  // $effect(() => {
  // virtualStartCommand || virtualEndCommand || hovered || clicked;
  // });

  // Debug

  // Update selected state
  $effect(() => {
    if (!centerPoint.hovered && dragged) {
      context.setDraggedPart(part);

      if (dragged && !part.selected && context.isDragged(part)) {
        context.setSelectedPart(part);
      }
    }

    if (!dragged && !canvasClick.pressed) {
      context.resetDraggedPart(part);
    }
  });

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
    virtualStartCommand.endPoint = navigation.toVirtualPoint(realStartCommand.endPoint);
    virtualEndCommand.endPoint = navigation.toVirtualPoint(realEndCommand.endPoint);

    // Update center point
    centerPoint.updateCenterPoint(center);
    centerPoint.update();

    hovered = hoverLine({
      line: {
        start: virtualStartCommand.endPoint,
        end: virtualEndCommand.endPoint
      }, cursorPosition
    });
    clicked = hovered && canvasClick.single;
    dragged = (dragged && canvasClick.pressed) || (hovered && canvasClick.pressed && !context.isDragged(part));

    center = centerOfSegment({
      start: virtualStartCommand.endPoint,
      end: virtualEndCommand.endPoint
    });

    // Move with cursor
    if (dragged && context.isDragged(part)) {
      let x = cursorPosition.x - canvasClick.clickPoint.x;
      let y = cursorPosition.y - canvasClick.clickPoint.y;
      canvasClick.setClickPoint(cursorPosition.pos)

      realStartCommand.endPoint.x += x;
      realStartCommand.endPoint.y += y;

      realEndCommand.endPoint.x += x;
      realEndCommand.endPoint.y += y;
    }

    // Move with arrow keys
    if (keyTimer.finished() && part.selected && keys.currentKey) {
      let shiftMultiplier = keys.containKey("Shift") ? 10 : 1;
      let xShift = (keys.isPressed("ArrowLeft") ? -1 : keys.isPressed("ArrowRight") ? 1 : 0) * shiftMultiplier;
      let yShift = (keys.isPressed("ArrowUp") ? -1 : keys.isPressed("ArrowDown") ? 1 : 0) * shiftMultiplier;

      virtualStartCommand.endPoint.x += xShift;
      virtualStartCommand.endPoint.y += yShift;

      virtualEndCommand.endPoint.x += xShift;
      virtualEndCommand.endPoint.y += yShift;
    }

    // Add a new point when clicking on the center point
    if (centerPoint.clicked && context.isDragged(part) === null) {
      context.strokeGeometriesCommands[geometryIndex].splice(startIndex + 1, 0, {
        type: "L",
        relative: false,
        endPoint: centerPoint.centerPoint
      });
    }
  }


  // Draw functions
  function drawDefault(ctx: CanvasRenderingContext2D) {
    line({
      ctx,
      start: virtualStartCommand.endPoint,
      end: virtualEndCommand.endPoint,
    });
  }

  function drawHovered(ctx: CanvasRenderingContext2D) {
    line({
      ctx,
      start: virtualStartCommand.endPoint,
      end: virtualEndCommand.endPoint,
      weight: 2
    });

    centerPoint.draw(ctx);
  }

  function drawSelected(ctx: CanvasRenderingContext2D) {
    line({
      ctx,
      start: virtualStartCommand.endPoint,
      end: virtualEndCommand.endPoint,
      color: "rgb(12, 140, 233)",
      weight: 2
    });
  }
</script>
