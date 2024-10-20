<script lang="ts">
  import {Rect} from "$lib/Rect.svelte";
  import {rect as drawRect} from "$lib/primitive/rect";
  import {canvasColors} from "$lib/stores/canvasColors";
  import {line} from "$lib/primitive/line";
  import {canvasClick} from "$lib/stores/canvasClick.svelte";
  import {Timer} from "$lib/stores/canvasTime.svelte";
  import type {VectorPart} from "$lib/types/VectorPart";
  import {useId} from "@fig/functions/id";
  import {
    getVectorContext,
    registerVectorPart
  } from "$lib/context/vectorContext";
  import {getCanvasContext} from "$lib/context/canvasContext";
  import type {
    CPathCommand,
    HasEndPoint
  } from "@fig/functions/path/PathCommand";
  import {
    handleVectorPartDrawing,
    handleVectorPartSelection
  } from "$lib/components/shared.svelte";
  import {navigation} from "$lib/stores/navigation.svelte";

  type Props = {
    type: "start" | "end",
    geometryIndex: number;
    commandIndex: number
  }

  let {type, geometryIndex, commandIndex}: Props = $props();

  const DIAMOND_DEFAULT_SIZE: number = 6;
  const DIAMOND_SELECTED_SIZE: number = 8;

  let hovered = $state(false);
  let clicked = $state(false);
  let dragged = $state(false);
  let active = $state(true);

  let rect: Rect = Rect.new();

  let clickTimer = new Timer(10, "Repeating");

  let canvasContext = getCanvasContext();
  let vectorContext = getVectorContext();

  let previousCommand = $state(vectorContext.strokeGeometriesCommands[geometryIndex][commandIndex - 1] as HasEndPoint);
  let controlledCurve = $state(vectorContext.strokeGeometriesCommands[geometryIndex][commandIndex]) as CPathCommand;

  // End point of the control point
  let controlledPoint = $state(type === "start" ? navigation.toVirtualPoint(previousCommand.endPoint) : navigation.toVirtualPoint(controlledCurve.endPoint));
  let controlPoint = $state(navigation.toVirtualPoint(controlledCurve.controlPoints[type]));

  // Register control point part
  let part: VectorPart = $state({
    id: useId(),
    type: "controlPoint",
    commandTuplesList: [commandIndex],
    draw,
    update,
    selected: false
  });

  registerVectorPart(part);

  // Update rect size
  $effect(() => {
    if (part.selected) {
      rect.width = DIAMOND_SELECTED_SIZE;
      rect.height = DIAMOND_SELECTED_SIZE;
    } else {
      rect.width = DIAMOND_DEFAULT_SIZE;
      rect.height = DIAMOND_DEFAULT_SIZE;
    }
  })

  // Update selected state
  handleVectorPartSelection(() => hovered, () => dragged, () => part);

  // Functions
  function draw(ctx: CanvasRenderingContext2D) {
    if (!active) return;

    handleVectorPartDrawing(ctx, () => hovered, () => clicked, () => dragged, () => part, drawDefault, drawHovered, drawSelected, vectorContext);
  }

  function drawDefault(ctx: CanvasRenderingContext2D) {
    line({
      ctx,
      start: rect.center,
      end: controlledPoint,
      color: canvasColors.gray,
      weight: 1.5,
    });

    drawRect({
      ctx,
      x: rect.center.x,
      y: rect.center.y,
      width: rect.width,
      height: rect.height,
      colors: {
        background: canvasColors.white,
        stroke: canvasColors.blue,
      },
      strokeWeight: 1,
      rotation: 45,
    });
  }

  function drawHovered(ctx: CanvasRenderingContext2D) {
    line({
      ctx,
      start: rect.center,
      end: controlledPoint,
      color: canvasColors.lightBlue,
      weight: 1.5,
    });

    drawRect({
      ctx,
      x: rect.center.x,
      y: rect.center.y,
      width: rect.width,
      height: rect.height,
      colors: {
        background: canvasColors.white,
        stroke: canvasColors.white,
      },
      strokeWeight: 1,
      rotation: 45,
    });
  }

  function drawSelected(ctx: CanvasRenderingContext2D) {
    line({
      ctx,
      start: rect.center,
      end: controlledPoint,
      color: canvasColors.blue,
      weight: 1.5,
    });

    drawRect({
      ctx,
      x: rect.center.x,
      y: rect.center.y,
      width: rect.width,
      height: rect.height,
      colors: {
        background: canvasColors.blue,
        stroke: canvasColors.white,
      },
      strokeWeight: 2,
      rotation: 45,
    });
  }

  function update() {
    rect.centerX = controlPoint.x;
    rect.centerY = controlPoint.y;
    controlPoint = navigation.toVirtualPoint(controlledCurve.controlPoints[type]);
    controlledPoint = type === "start" ? navigation.toVirtualPoint(previousCommand.endPoint) : navigation.toVirtualPoint(controlledCurve.endPoint);

    hovered = rect.hovered();
    clicked = hovered && canvasClick.pressed;

    if (hovered && canvasClick.pressed && clickTimer.finished()) {
      // toggleSelect();
    }
  }

</script>
