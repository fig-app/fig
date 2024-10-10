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
  import {Timer} from "$lib/stores/canvasTime.svelte"
  import {selector} from "$lib/components/Selector.svelte";

  type Props = {
    geometryIndex: number;
    pointIndex: number;
  }

  let {geometryIndex, pointIndex}: Props = $props();

  let point = new EditPoint();
  let dragged = $state(false);

  let loadTimer = new Timer(10, "Once");

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

  // Real and virtual commands
  let realCommand = $state(vectorContext.strokeGeometriesCommands[geometryIndex][pointIndex] as MLTPathCommand);
  let virtualCommand = $state({...realCommand});

  // Update canvas when this variables change (trigger the redraw)
  canvasContext.updateCanvas(() => [realCommand, part.selected, point.hovered, point.clicked])

  // Update selected state
  $effect(() => {
    if (dragged) {
      selector.disable();
      vectorContext.setDraggedPart(part);

      if (dragged && !part.selected && vectorContext.isDragged(part)) {
        selector.selectSinglePart(part);
      }
    }
  })

  $effect(() => {
    if (!dragged && !canvasClick.pressed) {
      selector.enable();
      vectorContext.resetDraggedPart(part);
    }
  })

  $effect(() => {
    if (point.hovered && !selector.inSelection) {
      selector.disable();
    } else if (!point.hovered && !dragged) {
      selector.enable();
    }
  })

  // Functions
  function draw(ctx: CanvasRenderingContext2D) {
    if (!loadTimer.finished()) return;

    if (dragged && vectorContext.isDragged(part)) {
      point.drawSelected(ctx);
    } else if (point.hovered && part.selected) {
      point.drawHovered(ctx);
    } else if (part.selected) {
      point.drawSelected(ctx);
    } else if (point.hovered && vectorContext.isDragged(part) === null) {
      if (point.clicked) {
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

    dragged = ((dragged && canvasClick.pressed) || (point.hovered && canvasClick.pressed && !vectorContext.isDragged(part))) && !selector.inSelection;

    if (dragged && vectorContext.isDragged(part)) {
      let x = (cursorPosition.x - canvasClick.realClickPoint.x) / navigation.scale;
      let y = (cursorPosition.y - canvasClick.realClickPoint.y) / navigation.scale;
      canvasClick.setClickPoint(cursorPosition.pos);

      realCommand.endPoint.x += x;
      realCommand.endPoint.y += y;
    }
  }

</script>


