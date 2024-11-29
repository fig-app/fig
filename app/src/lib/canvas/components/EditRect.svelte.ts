import { Rect } from "../Rect.svelte.js";
import type { Vector } from "@fig/types/properties/Vector";
import { canvasColors } from "$lib/canvas/stores/canvasColors";

const RECT_SIZE: number = 6;

export class EditRect {
  rect: Rect;

  constructor(center: Vector) {
    this.rect = new Rect({
      x: center.x,
      y: center.y,
      width: RECT_SIZE,
      height: RECT_SIZE,
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.rect.draw({
      ctx,
      colors: {
        background: canvasColors.white,
        stroke: canvasColors.blue,
      },
      strokeWeight: 1,
    });
  }

  hovered() {
    return this.rect.hovered();
  }

  clicked() {
    return this.rect.clicked();
  }

  update() {}
}
