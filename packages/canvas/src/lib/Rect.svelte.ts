import type { Vector } from "@fig/types/properties/Vector";
import type { Line } from "@fig/types/shapes/Line";
import { cursorPosition } from "$lib/stores/cursorPosition.svelte";
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
