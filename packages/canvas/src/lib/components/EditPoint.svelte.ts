import type { Vector } from "@fig/types/properties/Vector";
import { arc } from "$lib/primitive/arc";
import { getPrimitiveBlue, getPrimitiveWhite } from "@fig/functions/color";
import { isCursorHoveringArc } from "@fig/functions/shape/arc";
import { cursorPosition } from "$lib/stores/cursorPosition.svelte";
import { canvasClick } from "$lib/stores/canvasClick.svelte";

const RADIUS_DEFAULT: number = 4;
const RADIUS_SELECTED: number = 5;
const PRIMITIVE_BLUE: string = getPrimitiveBlue();
const PRIMITIVE_WHITE: string = getPrimitiveWhite();

type EditPointStates = {
  hovered: boolean;
  clicked: boolean;
  centerPoint: Vector;
};

export class EditPoint {
  private states: EditPointStates = $state({
    hovered: false,
    clicked: false,
    centerPoint: { x: 0, y: 0 },
  });

  constructor() {}

  get hovered() {
    return this.states.hovered;
  }

  get clicked() {
    return this.states.clicked;
  }

  get centerPoint() {
    return this.states.centerPoint;
  }

  updateCenterPoint(centerPoint: Vector) {
    this.states.centerPoint = centerPoint;
  }

  update() {
    this.states.hovered = isCursorHoveringArc({
      cursorPosition,
      arc: {
        centerPosition: this.states.centerPoint,
        radius: RADIUS_DEFAULT + 2,
      },
    });

    this.states.clicked = this.states.hovered && canvasClick.pressed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.states.hovered) {
      this.drawHovered(ctx);
    } else {
      this.drawDefault(ctx);
    }
  }

  drawDefault(ctx: CanvasRenderingContext2D) {
    arc({
      ctx,
      x: this.states.centerPoint.x,
      y: this.states.centerPoint.y,
      radius: RADIUS_DEFAULT,
    });
  }

  drawHovered(ctx: CanvasRenderingContext2D) {
    arc({
      ctx,
      x: this.states.centerPoint.x,
      y: this.states.centerPoint.y,
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
      x: this.states.centerPoint.x,
      y: this.states.centerPoint.y,
      radius: RADIUS_SELECTED,
      colors: {
        background: PRIMITIVE_BLUE,
        stroke: PRIMITIVE_WHITE,
      },
    });
  }
}
