import {
  initializeTransformCorners,
  TransformCorner,
} from "$lib/canvas/components/TransformCorner.svelte";
import { selector } from "$lib/canvas/components/Selector.svelte";
import { userState } from "$lib/canvas/stores/userState.svelte";

/**
 * This class is used to handle the transformation of all nodes present in the canvas.
 */
class CanvasTransform {
  // Corners which is grafted onto the selected node or nodes
  transformCorners: TransformCorner[] = $state(initializeTransformCorners());

  constructor() {}

  draw(ctx: CanvasRenderingContext2D) {
    // Draw transform corners
    if (selector.hasSelectedNodes()) {
      for (let corner of this.transformCorners) {
        corner.draw(ctx);
      }
    }
  }

  update() {
    // Update transform corners
    // TODO - Change to update the corners on a group of selected nodes
    if (selector.selectedNode && userState.isDragging) {
      for (let [i, corner] of selector.selectedNode.boundingBox.corners.entries()) {
        this.transformCorners[i].update(corner);
      }
    }
  }
}

export const canvasTransform = new CanvasTransform();
