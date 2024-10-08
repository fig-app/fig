import type { Vector } from "@fig/types/properties/Vector";
import { cursorPosition } from "$lib/stores/cursorPosition";
import { hoverRect } from "@fig/functions/shape/rect";
import { canvasClick } from "$lib/stores/canvasClick";

export class Rect {
  topLeft: Vector = { x: 0, y: 0 };
  width: number = 0;
  height: number = 0;

  constructor(x: number, y: number, width: number, height: number) {
    this.topLeft.x = x;
    this.topLeft.y = y;
    this.width = width;
    this.height = height;
  }

  hovered(): boolean {
    return hoverRect(cursorPosition, this.topLeft, this.width, this.height);
  }

  clicked(): boolean {
    return this.hovered() && canvasClick.pressed;
  }

  update(x: number, y: number, width: number, height: number) {
    this.topLeft.x = x;
    this.topLeft.y = y;
    this.width = width;
    this.height = height;
  }
}
