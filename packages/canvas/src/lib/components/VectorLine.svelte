<script lang="ts">
  import type {VectorPart} from "$lib/types/VectorPart";
  import type {MLTPathCommand} from "@fig/functions/path/PathCommand";
  import {
    centerOfSegment,
    getLineLength,
    hoverLine
  } from "@fig/functions/shape/line";
  import {cursorPosition} from "$lib/stores/cursorPosition.svelte";
  import {canvasClick} from "$lib/stores/canvasClick.svelte";
  import {useId} from "@fig/functions/id";
  import {keys} from "../stores/keys.svelte";
  import {Timer} from "$lib/stores/canvasTime.svelte";
  import {EditPoint} from "$lib/components/EditPoint.svelte";
  import {navigation} from "$lib/stores/navigation.svelte";
  import {
    getVectorContext,
    registerVectorPart
  } from "$lib/context/vectorContext";
  import {getCanvasContext} from "$lib/context/canvasContext";
  import {selector} from "$lib/components/Selector.svelte";
  import {line} from "$lib/primitive/line";
  import {canvasColors} from "$lib/stores/canvasColors";
  import {
    handleVectorPartDrawing,
    handleVectorPartSelection
  } from "$lib/components/shared.svelte";

  type Props = {
    geometryIndex: number;
    startIndex: number;
    endIndex: number;
  }

  let {geometryIndex, startIndex, endIndex}: Props = $props();

  let hovered = $state(false);
  let clicked = $state(false);
  let dragged = $state(false);

  let centerPoint = new EditPoint();

  let keyTimer = new Timer(100, "Repeating");
  let loadTimer = new Timer(10, "Once");

  let canvasContext = getCanvasContext();
  let vectorContext = getVectorContext();

  // Register line part
  let part: VectorPart = $state({
    id: useId(),
    type: "line",
    commandsIndex: [startIndex, endIndex],
    draw,
    update,
    selected: false
  });

  registerVectorPart(part);

  // Line commands
  let realStartCommand = $state(vectorContext.strokeGeometriesCommands[geometryIndex][startIndex] as MLTPathCommand);
  let realEndCommand = $state(vectorContext.strokeGeometriesCommands[geometryIndex][endIndex] as MLTPathCommand);
  let virtualStartCommand = $state({...realStartCommand});
  let virtualEndCommand = $state({...realEndCommand});

  let virtualLine = $derived({
    start: virtualStartCommand.endPoint,
    end: virtualEndCommand.endPoint
  });

  let lineLength = $derived(getLineLength({
    start: virtualStartCommand.endPoint,
    end: virtualEndCommand.endPoint
  }))

  let center = $derived(centerOfSegment({
    start: virtualStartCommand.endPoint,
    end: virtualEndCommand.endPoint
  }));

  let showCenterPoint = $derived(lineLength > 40);

  // Force update when this variables change (trigger the redraw)
  canvasContext.updateCanvas(() => [realStartCommand, realEndCommand, hovered, clicked, part.selected, centerPoint.hovered]);

  // Update selected state
  handleVectorPartSelection(() => hovered, () => dragged, () => part);

  // Special case for center point
  $effect(() => {
    if (centerPoint.hovered) {
      selector.disable();
    }

    if (centerPoint.hovered && !selector.inSelection) {
      selector.disable();
    } else {
      selector.enable();
    }
  })

  // Functions
  function draw(ctx: CanvasRenderingContext2D) {
    if (!loadTimer.finished()) return;

    handleVectorPartDrawing(ctx, () => hovered, () => clicked, () => dragged, () => part, drawDefault, drawHovered, drawSelected, vectorContext);
  }

  function update() {
    virtualStartCommand.endPoint = navigation.toVirtualPoint(realStartCommand.endPoint);
    virtualEndCommand.endPoint = navigation.toVirtualPoint(realEndCommand.endPoint);

    hovered = hoverLine({
      line: {
        start: virtualStartCommand.endPoint,
        end: virtualEndCommand.endPoint
      }, cursorPosition
    }) && !selector.inSelection;
    clicked = hovered && canvasClick.single;
    dragged = ((dragged && canvasClick.pressed) || (hovered && canvasClick.pressed && !vectorContext.isDragged(part))) && !selector.inSelection;

    if (selector.rect) {
      if (selector.pointMode) {
        if (selector.rect.containLine(virtualLine)) {
          selector.selectPart(part);
        } else {
          selector.unselectPart(part);
        }
      } else {
        if (selector.rect.collideLine(virtualLine)) {
          selector.selectPart(part);
        } else {
          selector.unselectPart(part);
        }
      }
    }

    // Move with cursor
    if (dragged && vectorContext.isDragged(part)) {
      let x = (cursorPosition.x - canvasClick.realClickPoint.x) / navigation.scale;
      let y = (cursorPosition.y - canvasClick.realClickPoint.y) / navigation.scale;
      canvasClick.setClickPoint(cursorPosition.pos);

      let selectedCommands = selector.selectedPartsCommandsIndex();

      for (const selectedCommand of selectedCommands) {
        let command = vectorContext.strokeGeometriesCommands[geometryIndex][selectedCommand] as MLTPathCommand;
        command.endPoint.x += x;
        command.endPoint.y += y;
      }
    }

    // Move with arrow keys
    if (keyTimer.finished() && part.selected && keys.anyPressed) {
      let shiftMultiplier = keys.shiftPressed() ? 10 : 0.5;
      let xShift = (keys.isPressed("ArrowLeft") ? -1 : keys.isPressed("ArrowRight") ? 1 : 0) * shiftMultiplier;
      let yShift = (keys.isPressed("ArrowUp") ? -1 : keys.isPressed("ArrowDown") ? 1 : 0) * shiftMultiplier;

      let selectedCommands = selector.selectedPartsCommandsIndex();

      for (const selectedCommand of selectedCommands) {
        let command = vectorContext.strokeGeometriesCommands[geometryIndex][selectedCommand] as MLTPathCommand;
        command.endPoint.x += xShift;
        command.endPoint.y += yShift;
      }
    }

    if (part.selected && keys.shiftPressed()) {
      canvasContext.redraw();
    }

    if (showCenterPoint) {
      // Update center point
      centerPoint.updateCenterPoint(center);
      centerPoint.update();

      // Add a new point when clicking on the center point
      if (centerPoint.clicked && vectorContext.isDragged(part) === null && !selector.inSelection) {
        vectorContext.strokeGeometriesCommands[geometryIndex].splice(startIndex + 1, 0, {
          type: "L",
          relative: false,
          endPoint: navigation.toRealPoint(center),
        });
        vectorContext.updateVector();
      }
    }
  }

  // Draw functions
  function drawDefault(ctx: CanvasRenderingContext2D) {
    line({
      ctx,
      start: virtualStartCommand.endPoint,
      end: virtualEndCommand.endPoint,
      color: canvasColors.gray
    });
  }

  function drawHovered(ctx: CanvasRenderingContext2D) {
    line({
      ctx,
      start: virtualStartCommand.endPoint,
      end: virtualEndCommand.endPoint,
      weight: 1,
      color: canvasColors.lightBlue
    });

    if (showCenterPoint) {
      centerPoint.draw(ctx);
    }
  }

  function drawSelected(ctx: CanvasRenderingContext2D) {
    line({
      ctx,
      start: virtualStartCommand.endPoint,
      end: virtualEndCommand.endPoint,
      color: canvasColors.blue,
      weight: 2
    });
  }
</script>
