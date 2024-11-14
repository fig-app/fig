import type { Vector } from "@fig/types/properties/Vector";
import { arc } from "$lib/canvas/primitive/arc";
import { isCursorHoveringArc } from "@fig/functions/shape/arc";
import { cursorPosition } from "$lib/stores";
import { canvasClick } from "$lib/canvas/stores/canvasClick.svelte.js";
import { canvasColors } from "$lib/canvas/stores/canvasColors";

const RADIUS_DEFAULT: number = 4;
const RADIUS_SELECTED: number = 5;
const PRIMITIVE_BLUE: string = canvasColors.blue;
const PRIMITIVE_WHITE: string = canvasColors.white;

export class EditPoint {
  hovered: boolean = $state(false);
  clicked: boolean = $state(false);
  centerPoint: Vector = $state({ x: 0, y: 0 });

  constructor() {}

  updateCenterPoint(centerPoint: Vector) {
    this.centerPoint = centerPoint;
  }

  update() {
    this.hovered = isCursorHoveringArc({
      cursorPosition: cursorPosition.offsetPos,
      arc: {
        centerPosition: this.centerPoint,
        radius: RADIUS_DEFAULT + 2,
      },
    });

    this.clicked = this.hovered && canvasClick.pressed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.hovered) {
      this.drawHovered(ctx);
    } else {
      this.drawDefault(ctx);
    }
  }

  drawDefault(ctx: CanvasRenderingContext2D) {
    arc({
      ctx,
      x: this.centerPoint.x,
      y: this.centerPoint.y,
      radius: RADIUS_DEFAULT,
    });
  }

  drawHovered(ctx: CanvasRenderingContext2D) {
    arc({
      ctx,
      x: this.centerPoint.x,
      y: this.centerPoint.y,
      radius: RADIUS_DEFAULT,
      colors: {
        background: PRIMITIVE_WHITE,
        stroke: PRIMITIVE_WHITE,
      },
    });
  }

  drawSelected(ctx: CanvasRenderingContext2D) {
    arc({
      ctx,
      x: this.centerPoint.x,
      y: this.centerPoint.y,
      radius: RADIUS_SELECTED,
      colors: {
        background: PRIMITIVE_BLUE,
        stroke: PRIMITIVE_WHITE,
      },
    });
  }
}
