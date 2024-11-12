import type { Vector } from "@fig/types/properties/Vector";
import type { Line } from "@fig/types/shapes/Line";
import { cursorPosition } from "@fig/stores";
import { hoverRect } from "@fig/functions/shape/rect";
import { canvasClick } from "$lib/stores/canvasClick.svelte";
import { rect } from "$lib/primitive/rect";
import { linesIntersection } from "@fig/functions/shape/line";

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

  set centerX(value: number) {
    this.topLeft.x = value - this.width;
  }

  set centerY(value: number) {
    this.topLeft.y = value - this.height;
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
    // Normalize the boundaries for the first rectangle
    const left1 = Math.min(this.x, this.x + this.width);
    const right1 = Math.max(this.x, this.x + this.width);
    const top1 = Math.min(this.y, this.y + this.height);
    const bottom1 = Math.max(this.y, this.y + this.height);

    // Normalize the boundaries for the second rectangle in case there is some weird node bounding box
    const left2 = Math.min(rect.x, rect.x + rect.width);
    const right2 = Math.max(rect.x, rect.x + rect.width);
    const top2 = Math.min(rect.y, rect.y + rect.height);
    const bottom2 = Math.max(rect.y, rect.y + rect.height);

    // Check for No(condition for overlap)
    return !(
      right1 <= left2 ||
      left1 >= right2 ||
      bottom1 <= top2 ||
      top1 >= bottom2
    );
  }

  collideLine(line: Line): boolean {
    const { x: x1, y: y1 } = line.start;
    const { x: x2, y: y2 } = line.end;

    const corners = this.corners;

    // Lines of the rectangle
    const rectLines = [
      { start: corners[0], end: corners[1] }, // Top edge
      { start: corners[1], end: corners[2] }, // Right edge
      { start: corners[2], end: corners[3] }, // Bottom edge
      { start: corners[3], end: corners[0] }, // Left edge
    ];

    // Check if the line intersects with any side of the rectangle
    for (const rectLine of rectLines) {
      if (
        linesIntersection(
          { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } },
          rectLine,
        )
      ) {
        return true;
      }
    }

    return false;
  }

  containPoint(point: Vector) {
    const minX = Math.min(this.x, this.x + this.width);
    const maxX = Math.max(this.x, this.x + this.width);
    const minY = Math.min(this.y, this.y + this.height);
    const maxY = Math.max(this.y, this.y + this.height);

    return (
      minX <= point.x && minY <= point.y && maxX >= point.x && maxY >= point.y
    );
  }

  containLine(line: Line) {
    return this.containPoint(line.start) && this.containPoint(line.end);
  }
}
