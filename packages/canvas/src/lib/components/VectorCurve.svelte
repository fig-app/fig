<script lang="ts">
  import {getCanvasContext} from "$lib/context/canvasContext";
  import {
    getVectorContext,
    registerVectorPart
  } from "$lib/context/vectorContext";
  import type {VectorPart} from "$lib/types/VectorPart";
  import {useId} from "@fig/functions/id";
  import {
    commandHasEndPoint,
    isCPathCommand
  } from "@fig/functions/path/typeCheck";
  import {cubicCurve} from "$lib/primitive/cubicCurve";
  import {navigation} from "$lib/stores/navigation.svelte";
  import {Timer} from "$lib/stores/canvasTime.svelte";
  import {isCubicBezierHovered} from "@fig/functions/shape/curve/cubic";
  import {cursorPosition} from "$lib/stores/cursorPosition.svelte";
  import {canvasColors} from "$lib/stores/canvasColors";
  import {
    handleVectorPartDrawing,
    handleVectorPartSelection
  } from "$lib/components/shared.svelte";
  import {canvasClick} from "$lib/stores/canvasClick.svelte";
  import {removeArrayOfTupleDuplicates} from "@fig/functions/array";

  type Props = {
    geometryIndex: number;
    startIndex: number;
    startCommandTuplesList: [number, number][];
    endCommandTuplesList: [number, number][];
  }

  let {
    geometryIndex,
    startIndex,
    startCommandTuplesList,
    endCommandTuplesList
  }: Props = $props();

  let hovered = $state(false);
  let clicked = $state(false);
  let dragged = $state(false);

  let loadTimer = new Timer(10, "Once");

  let canvasContext = getCanvasContext();
  let vectorContext = getVectorContext();

  // Register curve part
  let part: VectorPart = $state({
    id: useId(),
    type: "curve",
    commandTuplesList: removeArrayOfTupleDuplicates(startCommandTuplesList.concat(endCommandTuplesList)),
    draw,
    update,
    selected: false
  });

  registerVectorPart(part);

  // Curve commands
  // start command can be line or cubic command
  let realStartCommand = $state(vectorContext.strokeGeometriesCommands[geometryIndex][startIndex]);
  // end command must be a cubic command
  let realEndCommand = $state(vectorContext.strokeGeometriesCommands[geometryIndex][startIndex + 1]);

  let virtualStartCommand = $state({...realStartCommand});
  let virtualEndCommand = $state({...realEndCommand});

  canvasContext.updateCanvas(() => [realStartCommand, realEndCommand, hovered])

  // Update selected state
  handleVectorPartSelection(() => hovered, () => dragged, () => part);

  // Functions
  function draw(ctx: CanvasRenderingContext2D) {
    if (!loadTimer.finished()) return;

    handleVectorPartDrawing(ctx, () => hovered, () => clicked, () => dragged, () => part, drawDefault, drawHovered, drawSelected, vectorContext);
  }

  function drawDefault(ctx: CanvasRenderingContext2D) {
    if (isCPathCommand(virtualEndCommand) && commandHasEndPoint(virtualStartCommand)) {
      cubicCurve({
        ctx,
        startPoint: virtualStartCommand.endPoint,
        startControlPoint: virtualEndCommand.controlPoints.start,
        endControlPoint: virtualEndCommand.controlPoints.end,
        endPoint: virtualEndCommand.endPoint,
        color: canvasColors.gray,
      });
    }
  }

  function drawHovered(ctx: CanvasRenderingContext2D) {
    if (isCPathCommand(virtualEndCommand) && commandHasEndPoint(virtualStartCommand)) {
      cubicCurve({
        ctx,
        startPoint: virtualStartCommand.endPoint,
        startControlPoint: virtualEndCommand.controlPoints.start,
        endControlPoint: virtualEndCommand.controlPoints.end,
        endPoint: virtualEndCommand.endPoint,
        color: canvasColors.lightBlue,
        weight: 1,
      });
    }
  }

  function drawSelected(ctx: CanvasRenderingContext2D) {
    if (isCPathCommand(virtualEndCommand) && commandHasEndPoint(virtualStartCommand)) {
      cubicCurve({
        ctx,
        startPoint: virtualStartCommand.endPoint,
        startControlPoint: virtualEndCommand.controlPoints.start,
        endControlPoint: virtualEndCommand.controlPoints.end,
        endPoint: virtualEndCommand.endPoint,
        color: canvasColors.blue,
        weight: 2,
      });
    }
  }

  function update() {
    // Update states
    if (isCPathCommand(virtualEndCommand) && commandHasEndPoint(virtualStartCommand)) {
      hovered = isCubicBezierHovered(
        virtualStartCommand.endPoint,
        virtualEndCommand.controlPoints.start,
        virtualEndCommand.controlPoints.end,
        virtualEndCommand.endPoint,
        cursorPosition.pos,
      );
      clicked = hovered && canvasClick.pressed;
      dragged = hovered && canvasClick.pressed && !vectorContext.isDragged(part);
    }

    // Update virtual commands
    if (commandHasEndPoint(virtualStartCommand) && commandHasEndPoint(realStartCommand)) {
      virtualStartCommand = navigation.toVirtualCommand(realStartCommand);
    }
    if (isCPathCommand(virtualEndCommand) && isCPathCommand(realEndCommand)) {
      virtualEndCommand = navigation.toVirtualCommand(realEndCommand);
    }
  }

</script>

<!--{#if (part.selected)}-->

<!--{#if (realStartCommand.type === "C")}-->
<!--  <VectorControlPoint-->
<!--    {geometryIndex}-->
<!--    type="start"-->
<!--    commandIndex={startIndex}-->
<!--  />-->
<!--{/if}-->

<!--{#if (realEndCommand.type === "C")}-->
<!--  <VectorControlPoint-->
<!--    {geometryIndex}-->
<!--    type="end"-->
<!--    commandIndex={startIndex + 1}-->
<!--  />-->
<!--{/if}-->

<!--{/if}-->