import type { Vector } from "@fig/types/properties/Vector";
import { Rect } from "$lib/canvas/Rect.svelte";
import { canvasColors } from "$lib/canvas/stores/canvasColors";

type Vertical = "top" | "bottom";
type Horizontal = "left" | "right";

const SIZE: number = 10;

export class TransformCorner {
  private rect: Rect = new Rect({ x: 0, y: 0 });
  position: Vector = $state({ x: 0, y: 0 });
  vertical: Vertical = $state("top");
  horizontal: Horizontal = $state("left");

  constructor(position: Vector, vertical: Vertical, horizontal: Horizontal) {
    this.position = position;
    this.vertical = vertical;
    this.horizontal = horizontal;
    this.rect.width = SIZE;
    this.rect.height = SIZE;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.rect.draw({
      ctx,
      colors: { background: canvasColors.white, stroke: canvasColors.blue },
      strokeWeight: 1,
    });
  }

  update() {
    this.rect.center = this.position;

    if (this.vertical === "bottom") {
      this.rect.topLeft.y -= SIZE;
    }

    if (this.horizontal === "right") {
      this.rect.topLeft.x -= SIZE;
    }
  }
}
