<script lang="ts">
  import type {VectorPart} from "$lib/types/VectorPart";
  import {canvasClick} from "$lib/stores/canvasClick.svelte.js";
  import {navigation} from "$lib/stores/navigation.svelte.js";
  import {getVectorContext, registerVectorPart} from "$lib/context/vectorContext";
  import {getCanvasContext} from "$lib/context/canvasContext";
  import {EditPoint} from "$lib/components/vector/EditPoint.svelte";
  import {Timer} from "$lib/stores/canvasTime.svelte"
  import {selector} from "$lib/components/Selector.svelte";
  import {keys} from "@fig/stores";
  import {cursorHover} from "$lib/stores/cursorHover.svelte";
  import {
    handleVectorPartDragging,
    handleVectorPartDrawing,
    handleVectorPartSelection
  } from "$lib/components/vector/shared.svelte.js";
  import {useId} from "@fig/functions/id";
  import type {PathCommandWithEndPoint} from "@fig/functions/path/PathCommand";

  type Props = {
    commandTuplesList: [number, number][];
  }
  let {commandTuplesList}: Props = $props();

  let point = new EditPoint();
  let dragged = $state(false);

  let keyTimer = new Timer(100, "Repeating");
  let loadTimer = new Timer(10, "Once");

  let canvasContext = getCanvasContext();
  let vectorContext = getVectorContext();

  // Real and virtual commands
  let commandsList: PathCommandWithEndPoint[] = [];
  for (const commandTuple of commandTuplesList) {
    commandsList.push(vectorContext.strokeGeometriesCommands[commandTuple[0]][commandTuple[1]] as PathCommandWithEndPoint);
  }
  let virtualCommandsList = $state<PathCommandWithEndPoint[]>([]);
  $effect(() => {
    virtualCommandsList = commandsList.map((command) => {
      const virtualCommand = {...command};
      virtualCommand.endPoint = navigation.toVirtualPoint(virtualCommand.endPoint);
      return virtualCommand;
    })
  })

  // Register point part
  let part: VectorPart = $state({
    id: useId(),
    type: "point",
    commandTuplesList: commandTuplesList,
    draw,
    update,
    selected: false
  });
  registerVectorPart(part);

  // Update canvas when this variables change (trigger the redraw)
  canvasContext.updateCanvas(() => [part.selected, point.hovered, point.clicked]);

  // Update selected state
  handleVectorPartSelection(() => point.hovered, () => dragged, () => part);

  // Functions
  function draw(ctx: CanvasRenderingContext2D) {
    if (!loadTimer.finished()) return;
    handleVectorPartDrawing(ctx, () => point.hovered, () => point.clicked, () => dragged, () => part, drawDefault, drawHovered, drawSelected, vectorContext);
  }

  function drawDefault(ctx: CanvasRenderingContext2D) {
    point.drawDefault(ctx);
  }

  function drawHovered(ctx: CanvasRenderingContext2D) {
    point.drawHovered(ctx);
  }

  function drawSelected(ctx: CanvasRenderingContext2D) {
    point.drawSelected(ctx);
  }

  function update() {

    // Updating main visuals
    point.updateCenterPoint(virtualCommandsList[0].endPoint)
    point.update()

    // Updating hoveredPart, canceling the others if that point is hovered
    if (point.hovered) {
      cursorHover.hoveredPart = part;
    } else if (cursorHover.hoveredPart == part) {
      cursorHover.hoveredPart = null;
    }

    // Check if dragged
    dragged = ((dragged && canvasClick.pressed) || (point.hovered && canvasClick.pressed && !vectorContext.isDragged(part))) && !selector.inSelection;

    // Update selected state
    if (selector.rect) {
      if (selector.rect.containPoint(virtualCommandsList[0].endPoint)) {
        selector.selectPart(part);
      } else {
        selector.unselectPart(part);
      }
    }

    // Move with natural drag
    if (dragged && vectorContext.isDragged(part)) {
      handleVectorPartDragging(vectorContext);
    }

    if (part.selected && keys.shiftPressed()) {
      canvasContext.redraw();
    }
  }
</script>
