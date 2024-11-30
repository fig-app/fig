import type { Vector } from "@fig/types/properties/Vector";
import { Rect } from "$lib/canvas/Rect.svelte.js";
import { canvasColors } from "$lib/canvas/stores/canvasColors";
import { navigation } from "$lib/canvas/stores/navigation.svelte.js";
import { selector } from "$lib/canvas/components/Selector.svelte.js";
import { canvasClick } from "$lib/canvas/stores/canvasClick.svelte";
import { cursorPosition } from "$lib/stores";
import type { Horizontal, Vertical } from "$lib/canvas/types/Axis";
import { userState } from "$lib/canvas/stores/userState.svelte";
import { canvasTransform } from "$lib/canvas/stores/canvasTransform.svelte";

const SIZE: number = 8;

export class TransformCorner {
  rect: Rect = Rect.new();

  // Represents the center of the corner
  position: Vector = $state({ x: 0, y: 0 });
  vertical: Vertical = $state("top");
  horizontal: Horizontal = $state("left");

  dragged: boolean = $state(false);

  constructor(vertical: Vertical, horizontal: Horizontal) {
    this.vertical = vertical;
    this.horizontal = horizontal;
    this.rect.width = SIZE;
    this.rect.height = SIZE;
    this.rect.hoverDistance = 2;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.dragged) {
      this.rect.drawTopLeft({
        ctx,
        colors: { background: "red", stroke: "red" },
        strokeWeight: 2,
      });
    } else if (this.rect.hovered) {
      this.rect.drawTopLeft({
        ctx,
        colors: { background: canvasColors.blue, stroke: canvasColors.white },
        strokeWeight: 2,
      });
    } else {
      this.rect.drawTopLeft({
        ctx,
        colors: { background: canvasColors.white, stroke: canvasColors.blue },
        strokeWeight: 1,
      });
    }
  }

  update(position: Vector | null = null) {
    // If no corner is selected, update the position of the corner
    // based on the position of the selected node (passed as an argument)
    if (!canvasTransform.hasSelectedCorner() && position) {
      this.position = position;
    }

    // Adjust the size of the corner when zooming
    // This is a temporary solution
    if (navigation.percentScale < 100) {
      this.rect.width = SIZE * navigation.scale;
      this.rect.height = SIZE * navigation.scale;
    } else {
      this.rect.width = SIZE;
      this.rect.height = SIZE;
    }

    // Check for dragging
    if (this.rect.clicked && !canvasTransform.hasSelectedCorner()) {
      this.dragged = true;
      canvasTransform.setSelectedCorner(this);
      userState.isResizingNode = true;
    }
    // And not dragging
    else if (this.dragged && !canvasClick.pressed) {
      this.dragged = false;
      canvasTransform.unselectCorner();
      userState.isResizingNode = false;
    }

    // if (this.rect.hovered) {
    //   selector.disable();
    // } else {
    //   selector.enable();
    // }

    if (this.dragged && selector.selectedNode) {
      // Update the position of the corner
      this.position.x = cursorPosition.offsetX;
      this.position.y = cursorPosition.offsetY;

      // selector.selectedNode.resize.fromCorner(this.vertical, this.horizontal, this.position);

      // Disable selector
      selector.disable();
    }

    // console.log("dragged", this.dragged, canvasTransform.selectedCorner, selector.disabled);
    this.rect.center = this.position;
  }
}
