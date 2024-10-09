import type { Vector } from "@fig/types/properties/Vector";
import { cursorPosition } from "$lib/stores/cursorPosition.svelte";
import { hoverRect } from "@fig/functions/shape/rect";
import { canvasClick } from "$lib/stores/canvasClick.svelte";
import { rect } from "$lib/primitive/rect";

type RectStates = {
  topLeft: Vector;
  width: number;
  height: number;
};

type RectConstructorArgs = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

type RectDrawArgs = {
  ctx: CanvasRenderingContext2D;
  colors: {
    background: string | null;
    stroke: string | null;
  };
  strokeWeight: number;
};

export class Rect {
  private states: RectStates = $state({
    topLeft: { x: 0, y: 0 },
    width: 0,
    height: 0,
  });

  constructor({ x = 0, y = 0, width = 0, height = 0 }: RectConstructorArgs) {
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

  get center(): Vector {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    };
  }

  /**
   * Corners : top left, top right, bottom right, bottom left.
   */
  get corners(): Vector[] {
    return [
      this.topLeft,
      {
        x: this.x + this.width,
        y: this.y,
      },
      {
        x: this.x + this.width,
        y: this.y + this.height,
      },
      {
        x: this.x,
        y: this.y + this.height,
      },
    ];
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

  draw({ ctx, colors, strokeWeight }: RectDrawArgs) {
    rect({
      ctx,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      colors,
      strokeWeight,
      radius: 0,
    });
  }

  update(x: number, y: number, width: number, height: number) {
    this.states.topLeft.x = x;
    this.states.topLeft.y = y;
    this.states.width = width;
    this.states.height = height;
  }
}
