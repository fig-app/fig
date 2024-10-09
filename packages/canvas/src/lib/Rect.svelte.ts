import type { Vector } from "@fig/types/properties/Vector";
import { cursorPosition } from "$lib/stores/cursorPosition.svelte";
import { hoverRect } from "@fig/functions/shape/rect";
import { canvasClick } from "$lib/stores/canvasClick.svelte";

type RectStates = {
  topLeft: Vector;
  width: number;
  height: number;
};

export class Rect {
  private states: RectStates = $state({
    topLeft: { x: 0, y: 0 },
    width: 0,
    height: 0,
  });

  constructor(x: number, y: number, width: number, height: number) {
    this.states.topLeft.x = x;
    this.states.topLeft.y = y;
    this.states.width = width;
    this.states.height = height;
  }

  get x(): number {
    return this.states.topLeft.x;
  }

  get y(): number {
    return this.states.topLeft.y;
  }

  get topLeft(): Vector {
    return this.states.topLeft;
  }

  get width(): number {
    return this.states.width;
  }

  get height(): number {
    return this.states.height;
  }

  hovered(): boolean {
    return hoverRect(
      cursorPosition,
      this.states.topLeft,
      this.states.width,
      this.states.height,
    );
  }

  clicked(): boolean {
    return this.hovered() && canvasClick.pressed;
  }

  update(x: number, y: number, width: number, height: number) {
    this.states.topLeft.x = x;
    this.states.topLeft.y = y;
    this.states.width = width;
    this.states.height = height;
  }
}
