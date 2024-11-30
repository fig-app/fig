import { TransformCorner } from "$lib/canvas/components/TransformCorner.svelte";
import { selector } from "$lib/canvas/components/Selector.svelte";
import { userState } from "$lib/canvas/stores/userState.svelte";
import { canvasClick } from "$lib/canvas/stores/canvasClick.svelte";

/**
 * This class is used to handle the transformation of all nodes present in the canvas.
 */
class CanvasTransform {
  // Corners which is grafted onto the selected node or nodes
  transformCorners: TransformCorner[] = $state([]);
  selectedCorner: TransformCorner | null = $state(null);

  // Used to disable the selector when the corners are hovered
  // Maybe there is a better way to handle this
  hoveredCorners: boolean[] = $state([false, false, false, false]);

  constructor() {
    this.transformCorners = [
      new TransformCorner("top", "left"),
      new TransformCorner("top", "right"),
      new TransformCorner("bottom", "right"),
      new TransformCorner("bottom", "left"),
    ];
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (selector.hasSelectedNodes()) {
      // Draw transform corners
      for (let corner of this.transformCorners) {
        corner.draw(ctx);
      }
    }
  }

  update() {
    // Update transform corners
    // TODO - Change to update the corners on a group of selected nodes
    if (selector.selectedNode) {
      for (let [i, cornerPosition] of selector.selectedNode.boundingBox.corners.entries()) {
        let transformCorner = this.transformCorners[i];
        this.hoveredCorners[i] = transformCorner.rect.hovered;

        if (userState.isDragging) {
          transformCorner.update(cornerPosition);
        } else {
          transformCorner.update();
        }
      }

      if (this.hoveredCorners.includes(true)) {
        selector.disable();
      } else if (canvasClick.released) {
        // Timeout is used to avoid node deselection
        setTimeout(() => {
          selector.enable();
        }, 100);
      }
    }
  }

  setSelectedCorner(corner: TransformCorner) {
    this.selectedCorner = corner;
  }

  unselectCorner() {
    this.selectedCorner = null;
  }

  hasSelectedCorner() {
    return this.selectedCorner !== null;
  }
}

export const canvasTransform = new CanvasTransform();
