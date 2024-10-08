import type { Vector } from "@fig/types/properties/Vector";
import { arc } from "$lib/primitive/arc";
import { getPrimitiveBlue, getPrimitiveWhite } from "@fig/functions/color";
import { isCursorHoveringArc } from "@fig/functions/shape/arc";
import { cursorPosition } from "$lib/stores/cursorPosition";
import { canvasClick } from "$lib/stores/canvasClick";

const RADIUS_DEFAULT: number = 4;
const RADIUS_SELECTED: number = 5;
const PRIMITIVE_BLUE: string = getPrimitiveBlue();
const PRIMITIVE_WHITE: string = getPrimitiveWhite();

export class EditPoint {
  hovered: boolean;
  clicked: boolean;
  centerPoint: Vector;

  constructor() {
    this.hovered = false;
    this.clicked = false;
    this.centerPoint = { x: 0, y: 0 };
  }

  updateCenterPoint(centerPoint: Vector) {
    this.centerPoint = centerPoint;
  }

  update() {
    this.hovered = isCursorHoveringArc({
      cursorPosition,
      arc: {
        centerPosition: this.centerPoint,
        radius: RADIUS_DEFAULT,
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
