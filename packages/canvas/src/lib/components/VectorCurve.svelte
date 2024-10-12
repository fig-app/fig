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
    isCPathCommand,
    isMLTPathCommand
  } from "@fig/functions/path/typeCheck";
  import {cubicCurve} from "$lib/primitive/cubicCurve";
  import {navigation} from "$lib/stores/navigation.svelte";
  import {Timer} from "$lib/stores/canvasTime.svelte";
  import {EditControlPoint} from "$lib/components/EditControlPoint.svelte";
  import {pointsDistance} from "@fig/functions/shape/point";

  type Props = {
    geometryIndex: number;
    startIndex: number;
    endIndex: number;
  }

  let {geometryIndex, startIndex, endIndex}: Props = $props();

  let loadTimer = new Timer(10, "Once");

  let canvasContext = getCanvasContext();
  let vectorContext = getVectorContext();

  // Register curve part
  let part: VectorPart = $state({
    id: useId(),
    type: "curve",
    commandsIndex: [startIndex, endIndex],
    draw,
    update,
    selected: false
  });

  registerVectorPart(part);

  // Curve commands
  // start command can be line or cubic command
  let realStartCommand = $state(vectorContext.strokeGeometriesCommands[geometryIndex][startIndex]);
  // end command must be a cubic command
  let realEndCommand = $state(vectorContext.strokeGeometriesCommands[geometryIndex][endIndex]);

  let virtualStartCommand = $state({...realStartCommand});
  let virtualEndCommand = $state({...realEndCommand});

  // Curve control points
  let startControlPoint = new EditControlPoint(pointsDistance(realStartCommand.endPoint, realEndCommand.controlPoints.start) > 5)
  let endControlPoint = new EditControlPoint(pointsDistance(realEndCommand.endPoint, realEndCommand.controlPoints.end) > 5)

  canvasContext.updateCanvas(() => [realStartCommand, realEndCommand, startControlPoint.hovered, endControlPoint.hovered])

  function draw(ctx: CanvasRenderingContext2D) {
    if (!loadTimer.finished()) return;

    startControlPoint.draw(ctx);
    endControlPoint.draw(ctx);

    if (isMLTPathCommand(realStartCommand)) {

    } else if (isCPathCommand(realStartCommand)) {

    }

    if (isCPathCommand(virtualEndCommand) && commandHasEndPoint(virtualStartCommand)) {
      cubicCurve({
        ctx,
        startPoint: virtualStartCommand.endPoint,
        startControlPoint: virtualEndCommand.controlPoints.start,
        endControlPoint: virtualEndCommand.controlPoints.end,
        endPoint: virtualEndCommand.endPoint,
        color: "#ef1d1d",
        weight: 2,
      });
    }
  }

  function update() {
    if (commandHasEndPoint(virtualStartCommand) && commandHasEndPoint(realStartCommand)) {
      virtualStartCommand = navigation.toVirtualCommand(realStartCommand);
    }
    if (isCPathCommand(virtualEndCommand) && isCPathCommand(realEndCommand)) {
      virtualEndCommand = navigation.toVirtualCommand(realEndCommand);

      startControlPoint.update(virtualEndCommand.controlPoints.start, virtualStartCommand.endPoint);
      endControlPoint.update(virtualEndCommand.controlPoints.end, virtualEndCommand.endPoint);
    }
  }

</script>
