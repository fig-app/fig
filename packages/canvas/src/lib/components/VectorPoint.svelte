<script lang="ts">
  import type {VectorPart} from "$lib/types/VectorPart";
  import {cursorPosition} from "$lib/stores/cursorPosition.svelte";
  import {canvasClick} from "$lib/stores/canvasClick.svelte";
  import {useId} from "@fig/functions/id";
  import type {PathCommandWithEndPoint} from "@fig/functions/path/PathCommand";
  import {navigation} from "$lib/stores/navigation.svelte";
  import {getVectorContext, registerVectorPart} from "$lib/context/vectorContext";
  import {getCanvasContext} from "$lib/context/canvasContext";
  import {EditPoint} from "$lib/components/EditPoint.svelte";
  import {Timer} from "$lib/stores/canvasTime.svelte"
  import {selector} from "$lib/components/Selector.svelte";
  import {keys} from "$lib/stores/keys.svelte";
  import {cursorHover} from "$lib/stores/cursorHover.svelte";

  type Props = {
    listOfCommands: Array<PathCommandWithEndPoint>
  }
  let {listOfCommands}: Props = $props();

  let point = new EditPoint();
  let dragged = $state(false);

  let keyTimer = new Timer(100, "Repeating");
  let loadTimer = new Timer(10, "Once");

  let canvasContext = getCanvasContext();
  let vectorContext = getVectorContext();

  // Real and virtual commands
  // Vector point can have several virtual commands if it
  let listOfVirtualCommands = $state({...listOfCommands});

  // Register point part
  let part: VectorPart = $state({
    id: useId(),
    type: "point",
    commands: listOfCommands,
    draw,
    update,
    selected: false
  });
  registerVectorPart(part);

  // Update canvas when this variables change (trigger the redraw)
  canvasContext.updateCanvas(() => [listOfCommands, part.selected, point.hovered, point.clicked])

  // Update selected state
  $effect(() => {
    if (dragged) {
      selector.disable();
      vectorContext.setDraggedPart(part);

      if (dragged && !part.selected && vectorContext.isDragged(part)) {
        if (keys.shiftPressed()) {
          selector.selectPart(part);
        } else {
          selector.selectSinglePart(part);
        }
      }
    }
  })

  $effect(() => {
    if (!dragged && !canvasClick.pressed) {
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

    // Updating main visuals
    point.updateCenterPoint(listOfVirtualCommands[0].endPoint)
    point.update()

    // Updating hoveredPart, canceling the others if that point is hovered
    if (point.hovered) {
      cursorHover.hoveredPart = part;
    } else if (cursorHover.hoveredPart == part) {
      cursorHover.hoveredPart = null;
    }

    dragged = ((dragged && canvasClick.pressed) || (point.hovered && canvasClick.pressed && !vectorContext.isDragged(part))) && !selector.inSelection;

    if (selector.rect) {
      if (selector.rect.containPoint(listOfVirtualCommands[0].endPoint)) {
        selector.selectPart(part);
      } else {
        selector.unselectPart(part);
      }
    }

    // Move with natural drag
    if (dragged && vectorContext.isDragged(part)) {
      let x = (cursorPosition.x - canvasClick.realClickPoint.x) / navigation.scale;
      let y = (cursorPosition.y - canvasClick.realClickPoint.y) / navigation.scale;
      canvasClick.setClickPoint(cursorPosition.pos);

      // Move the current point and all the other selected ones
      let selectedCommands = selector.selectedPartsCommands();
      for (const selectedCommand of selectedCommands) {
        selectedCommand.endPoint.x += x;
        selectedCommand.endPoint.y += y;
      }
    }

    // Move with arrow keys
    if (keyTimer.finished() && part.selected && keys.anyPressed) {
      let shiftMultiplier = keys.shiftPressed() ? 10 : 0.5;
      let xShift = (keys.isPressed("ArrowLeft") ? -1 : keys.isPressed("ArrowRight") ? 1 : 0) * shiftMultiplier;
      let yShift = (keys.isPressed("ArrowUp") ? -1 : keys.isPressed("ArrowDown") ? 1 : 0) * shiftMultiplier;

      // Move the current point or all the points if several are selected
      let selectedCommands = selector.selectedPartsCommands();
      for (const selectedCommand of selectedCommands) {
        selectedCommand.endPoint.x += xShift;
        selectedCommand.endPoint.y += yShift;
      }
    }

    if (part.selected && keys.shiftPressed()) {
      canvasContext.redraw();
    }
  }
</script>
