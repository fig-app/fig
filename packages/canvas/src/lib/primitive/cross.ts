import { line } from "$lib/primitive/line";

type CrossArgs = {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  weight?: number;
};

export function cross({
  ctx,
  x,
  y,
  width = 10,
  height = 10,
  color,
  weight,
}: CrossArgs) {
  let halfWidth = width / 2;
  let halfHeight = height / 2;

  // top left to bottom right
  line({
    ctx,
    start: { x: x - halfWidth, y: y + halfHeight },
    end: { x: x + halfWidth, y: y - halfHeight },
    color,
    weight,
  });

  // bottom left to top right
  line({
    ctx,
    start: { x: x - halfWidth, y: y - halfHeight },
    end: { x: x + halfWidth, y: y + halfHeight },
    color,
    weight,
  });
}
