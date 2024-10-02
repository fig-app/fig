import type { Vector } from "@fig/types/properties/Vector";

type LineArgs = {
  ctx: CanvasRenderingContext2D;
  start: Vector;
  end: Vector;
  color?: string;
  weight?: number;
  cap?: CanvasLineCap;
  join?: CanvasLineJoin;
  dash?: number[];
};

export function line({
  ctx,
  start,
  end,
  color = "#fff",
  weight = 1,
  cap = "butt",
  join = "miter",
  dash = [],
}: LineArgs) {
  ctx.save();

  ctx.strokeStyle = color;
  ctx.lineWidth = weight;
  ctx.lineCap = cap;
  ctx.lineJoin = join;
  if (dash.length > 0) {
    ctx.setLineDash(dash);
  }

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();

  ctx.restore();
}
