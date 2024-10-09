<script lang="ts">
  import type {VectorPart} from "$lib/types/VectorPart";
  import {cursorPosition} from "$lib/stores/cursorPosition.svelte";
  import {canvasClick} from "$lib/stores/canvasClick.svelte";
  import {useId} from "@fig/functions/id";
  import type {MLTPathCommand} from "@fig/functions/path/PathCommand";
  import {navigation} from "$lib/stores/navigation.svelte";
  import {
    getVectorContext,
    registerVectorPart
  } from "$lib/context/vectorContext";
  import {getCanvasContext} from "$lib/context/canvasContext";
  import {EditPoint} from "$lib/components/EditPoint.svelte";

  type Props = {
    geometryIndex: number;
    pointIndex: number;
  }

  let {geometryIndex, pointIndex}: Props = $props();

  let point = new EditPoint();
  let hovered = $state(false);
  let clicked = $state(false);
  let dragged = $state(false);

  let canvasContext = getCanvasContext();
  let vectorContext = getVectorContext();

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
  let realCommand = $state(vectorContext.strokeGeometriesCommands[geometryIndex][pointIndex] as MLTPathCommand);
  let virtualCommand = $state({...realCommand});

  // Force update when this variables change (trigger the redraw)
  canvasContext.updateCanvas(() => [realCommand, part.selected, point.hovered, point.clicked])

  // Debug

  // Update selected state
  $effect(() => {
    if (dragged) {
      vectorContext.setDraggedPart(part);

      if (dragged && !part.selected && vectorContext.isDragged(part)) {
        part.selected = true;
        vectorContext.setSelectedPart(part);
      }
    }
  })

  $effect(() => {
    if (!dragged && !canvasClick.pressed) {
      vectorContext.resetDraggedPart(part);
    }
  })

  // Functions
  function draw(ctx: CanvasRenderingContext2D) {
    if (dragged && vectorContext.isDragged(part)) {
      point.drawSelected(ctx);
    } else if (hovered && part.selected) {
      point.drawHovered(ctx);
    } else if (part.selected) {
      point.drawSelected(ctx);
    } else if (hovered && vectorContext.isDragged(part) === null) {
      if (clicked) {
        point.drawSelected(ctx);
      } else {
        point.drawHovered(ctx);
      }
    } else {
      point.drawDefault(ctx);
    }
  }

  function update() {
    virtualCommand.endPoint = navigation.toVirtualPoint(realCommand.endPoint);

    point.updateCenterPoint(virtualCommand.endPoint)
    point.update()

    hovered = point.hovered;

    clicked = point.clicked;
    dragged = (dragged && canvasClick.pressed) || (hovered && canvasClick.pressed && !vectorContext.isDragged(part));

    if (dragged && vectorContext.isDragged(part)) {
      let x = (cursorPosition.x - canvasClick.clickPoint.x) / navigation.scale;
      let y = (cursorPosition.y - canvasClick.clickPoint.y) / navigation.scale;
      canvasClick.setClickPoint(cursorPosition.pos);

      realCommand.endPoint.x += x;
      realCommand.endPoint.y += y;
    }
  }

</script>


