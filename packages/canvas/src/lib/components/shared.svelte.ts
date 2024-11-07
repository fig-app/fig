import type { VectorPart } from "$lib/types/VectorPart";
import { getVectorContext } from "$lib/context/vectorContext";
import { keys } from "$lib/stores/keys.svelte";
import { canvasClick } from "$lib/stores/canvasClick.svelte";
import { selector } from "$lib/components/Selector.svelte";
import type { CanvasDrawFunction } from "$lib/types/CanvasFunction";
import type { VectorContext } from "$lib/types/VectorContext";
import { cursorPosition } from "$lib/stores/cursorPosition.svelte";
import { navigation } from "$lib/stores/navigation.svelte";
import type { PathCommandWithEndPoint } from "@fig/functions/path/PathCommand";

/**
 * Handle the selection of a vector part
 * Disable / enable the selector depending on the state of the component
 */
export function handleVectorPartSelection(
  hovered: () => boolean,
  dragged: () => boolean,
  part: () => VectorPart,
) {
  let vectorContext = getVectorContext();

  // Disable when dragging
  $effect(() => {
    if (dragged()) {
      selector.disable();
      vectorContext.setDraggedPart(part());

      if (dragged() && !part().selected && vectorContext.isDragged(part())) {
        if (keys.shiftPressed()) {
          selector.selectPart(part());
        } else {
          selector.selectSinglePart(part());
        }
      }
    }
  });

  // Reset dragged part when not dragging
  $effect(() => {
    if (!dragged() && !canvasClick.pressed) {
      vectorContext.resetDraggedPart(part());
    }
  });

  // Enable selection when not dragging
  $effect(() => {
    if (hovered() && !selector.inSelection) {
      selector.disable();
    } else if (!hovered() && !dragged()) {
      selector.enable();
    }
  });
}

/**
 * Handle the drawing of a vector part
 */
export function handleVectorPartDrawing(
  ctx: CanvasRenderingContext2D,
  hovered: () => boolean,
  clicked: () => boolean,
  dragged: () => boolean,
  part: () => VectorPart,
  drawDefault: CanvasDrawFunction,
  drawHovered: CanvasDrawFunction,
  drawSelected: CanvasDrawFunction,
  vectorContext: VectorContext,
) {
  if (dragged() && vectorContext.isDragged(part())) {
    drawSelected(ctx);
  } else if (hovered() && part().selected) {
    drawHovered(ctx);
  } else if (part().selected) {
    drawSelected(ctx);
  } else if (hovered() && vectorContext.isDragged(part()) === null) {
    if (clicked()) {
      drawSelected(ctx);
    } else {
      drawHovered(ctx);
    }
  } else {
    drawDefault(ctx);
  }
}

/**
 * Handle the dragging of a vector part
 */
export function handleVectorPartDragging(vectorContext: VectorContext) {
  let x = (cursorPosition.x - canvasClick.realClickPoint.x) / navigation.scale;
  let y = (cursorPosition.y - canvasClick.realClickPoint.y) / navigation.scale;
  canvasClick.setClickPoint(cursorPosition.pos);

  // Move the current point and all the other selected ones
  let selectedCommandTuples = selector.selectedPartsCommandTuples();
  // console.log(selectedCommandTuples);
  for (const selectedCommandTuple of selectedCommandTuples) {
    let geometryIndex = selectedCommandTuple[0];
    let commandIndex = selectedCommandTuple[1];
    let selectedCommand = vectorContext.strokeGeometriesCommands[geometryIndex][
      commandIndex
    ] as PathCommandWithEndPoint;
    selectedCommand.endPoint.x += x;
    selectedCommand.endPoint.y += y;
  }
}
