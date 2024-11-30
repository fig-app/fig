import type { Vector } from "@fig/types/properties/Vector";
import { Rect } from "$lib/canvas/Rect.svelte.js";
import { canvasColors } from "$lib/canvas/stores/canvasColors";
import { navigation } from "$lib/canvas/stores/navigation.svelte.js";
import { selector } from "$lib/canvas/components/Selector.svelte.js";
import { canvasClick } from "$lib/canvas/stores/canvasClick.svelte";
import { cursorPosition } from "$lib/stores";
import type { Horizontal, Vertical } from "$lib/canvas/types/Axis";

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

  update(position: Vector) {
    this.position = position;
    this.rect.center = this.position;

    // Adjust the size of the corner when zooming
    if (navigation.percentScale < 100) {
      this.rect.width = SIZE * navigation.scale;
      this.rect.height = SIZE * navigation.scale;
    } else {
      this.rect.width = SIZE;
      this.rect.height = SIZE;
    }

    // Check for dragging
    if (this.rect.clicked) {
      this.dragged = true;
    } else if (this.dragged && !canvasClick.pressed) {
      this.dragged = false;
    }

    if (this.dragged) {
      // Update the position of the corner
      this.position.x = cursorPosition.offsetX;
      this.position.y = cursorPosition.offsetY;

      // Disable selector
      selector.disable();
    }
  }
}

export function initializeTransformCorners(): TransformCorner[] {
  return [
    new TransformCorner("top", "left"),
    new TransformCorner("top", "right"),
    new TransformCorner("bottom", "right"),
    new TransformCorner("bottom", "left"),
  ];
}
