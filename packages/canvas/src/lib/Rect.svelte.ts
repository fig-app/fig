import type { Vector } from "@fig/types/properties/Vector";
import { cursorPosition } from "$lib/stores/cursorPosition.svelte";
import { hoverRect } from "@fig/functions/shape/rect";
import { canvasClick } from "$lib/stores/canvasClick.svelte";
import { rect } from "$lib/primitive/rect";

type RectConstructorArgs = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

type RectDrawArgs = {
  ctx: CanvasRenderingContext2D;
  colors: {
    background?: string;
    stroke?: string;
  };
  strokeWeight: number;
};

export class Rect {
  topLeft: Vector = $state({ x: 0, y: 0 });
  width = $state(0);
  height = $state(0);

  constructor({ x = 0, y = 0, width = 0, height = 0 }: RectConstructorArgs) {
    this.topLeft.x = x;
    this.topLeft.y = y;
    this.width = width;
    this.height = height;
  }

  static new() {
    return new Rect({});
  }

  // Getter and setter

  get x(): number {
    return this.topLeft.x;
  }

  get y(): number {
    return this.topLeft.y;
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

  // Functions

  hovered(): boolean {
    return hoverRect(cursorPosition, this.topLeft, this.width, this.height);
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

  drawTopLeft({ ctx, colors, strokeWeight }: RectDrawArgs) {
    rect({
      ctx,
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
      width: this.width,
      height: this.height,
      colors,
      strokeWeight,
      radius: 0,
    });
  }

  update(x: number, y: number, width: number, height: number) {
    this.topLeft.x = x;
    this.topLeft.y = y;
    this.width = width;
    this.height = height;
  }

  collide(rect: Rect): boolean {
    return (
      this.x < rect.x + rect.width &&
      this.x + this.width > rect.x &&
      this.y < rect.y + rect.height &&
      this.y + this.height > rect.y
    );
  }
}
