import { Rect } from "$lib/Rect.svelte";
import type { Vector } from "@fig/types/properties/Vector";
import { rect } from "$lib/primitive/rect";
import { canvasColors } from "$lib/stores/canvasColors";
import { line } from "$lib/primitive/line";

const DIAMOND_DEFAULT_SIZE: number = 6;
const DIAMOND_SELECTED_SIZE: number = 8;

type EditDiamondStates = {
  clicked: boolean;
  selected: boolean;
  active: boolean;
  controlledPoint: Vector;
};

export class EditControlPoint {
  rect: Rect;
  hovered = $state(true);
  private states: EditDiamondStates = $state({
    clicked: false,
    selected: false,
    active: false,
    controlledPoint: { x: 0, y: 0 },
  });

  constructor(active: boolean) {
    this.states.active = active;
    this.rect = new Rect({
      x: 0,
      y: 0,
      width: DIAMOND_DEFAULT_SIZE,
      height: DIAMOND_DEFAULT_SIZE,
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.states.active) return;

    if (this.hovered) {
      this.drawHovered(ctx);
    } else {
      this.drawDefault(ctx);
    }
  }

  drawDefault(ctx: CanvasRenderingContext2D) {
    line({
      ctx,
      start: this.rect.center,
      end: this.states.controlledPoint,
      color: canvasColors.gray,
      weight: 1.5,
    });

    rect({
      ctx,
      x: this.rect.center.x,
      y: this.rect.center.y,
      width: this.rect.width,
      height: this.rect.height,
      colors: {
        background: canvasColors.white,
        stroke: canvasColors.blue,
      },
      strokeWeight: 1,
      rotation: 45,
    });
  }

  drawHovered(ctx: CanvasRenderingContext2D) {
    line({
      ctx,
      start: this.rect.center,
      end: this.states.controlledPoint,
      color: canvasColors.lightBlue,
      weight: 1.5,
    });

    rect({
      ctx,
      x: this.rect.center.x,
      y: this.rect.center.y,
      width: this.rect.width,
      height: this.rect.height,
      colors: {
        background: canvasColors.white,
        stroke: canvasColors.white,
      },
      strokeWeight: 1,
      rotation: 45,
    });
  }

  drawSelected(ctx: CanvasRenderingContext2D) {
    line({
      ctx,
      start: this.rect.center,
      end: this.states.controlledPoint,
      color: canvasColors.gray,
      weight: 1.5,
    });

    rect({
      ctx,
      x: this.rect.x,
      y: this.rect.y,
      width: this.rect.width,
      height: this.rect.height,
      colors: {
        background: canvasColors.blue,
        stroke: canvasColors.white,
      },
      strokeWeight: 2,
      rotation: 45,
    });
  }

  clicked() {
    return this.rect.clicked();
  }

  selected() {
    return this.states.selected;
  }

  select() {
    this.states.selected = true;
    this.rect.width = DIAMOND_SELECTED_SIZE;
    this.rect.height = DIAMOND_SELECTED_SIZE;
  }

  unselect() {
    this.states.selected = false;
    this.rect.width = DIAMOND_DEFAULT_SIZE;
    this.rect.height = DIAMOND_DEFAULT_SIZE;
  }

  update(center: Vector, controlledPoint: Vector) {
    this.rect.centerX = center.x;
    this.rect.centerY = center.y;
    this.states.controlledPoint = controlledPoint;
    this.hovered = this.rect.hovered();
  }
}
