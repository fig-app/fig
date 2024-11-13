import {Rect} from "../Rect.svelte.js";
import type {Vector} from "@fig/types/properties/Vector";
import {canvasColors} from "$lib/stores/canvasColors";

const RECT_SIZE: number = 6;

type EditRectStates = {
  hovered: boolean;
  clicked: boolean;
  center: Vector;
};

export class EditRect {
  rect: Rect;
  private states: EditRectStates = $state({
    hovered: false,
    clicked: false,
    center: {x: 0, y: 0},
  });

  constructor(center: Vector) {
    this.states.center = center;
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

  update() {
  }
}
