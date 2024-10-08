import { getPrimitiveBlue, getPrimitiveWhite } from "@fig/functions/color";

const STROKE_DEFAULT: number = 1;

type StrokeArcArgs = {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  counterclockwise?: boolean;
  strokeWeight: number;
  color: string;
};

export function strokeArc({
  ctx,
  x,
  y,
  radius,
  startAngle,
  endAngle,
  counterclockwise,
  strokeWeight,
  color,
}: StrokeArcArgs) {
  ctx.save();
  ctx.moveTo(x, y);

  ctx.beginPath();
  ctx.arc(
    x,
    y,
    radius,
    startAngle * Math.PI,
    endAngle * Math.PI,
    counterclockwise,
  );
  ctx.lineWidth = strokeWeight;
  ctx.strokeStyle = color;
  ctx.stroke();

  ctx.restore();
}

type FillArcArgs = {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  counterclockwise?: boolean;
  color: string;
};

export function fillArc({
  ctx,
  x,
  y,
  radius,
  startAngle,
  endAngle,
  counterclockwise,
  color,
}: FillArcArgs) {
  ctx.save();
  ctx.moveTo(x, y);

  ctx.beginPath();
  ctx.arc(
    x,
    y,
    radius,
    startAngle * Math.PI,
    endAngle * Math.PI,
    counterclockwise,
  );
  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();
}

type ArcArgs = {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number;
  startAngle?: number;
  endAngle?: number;
  counterclockwise?: boolean;
  strokeWeight?: number;
  colors?: {
    background: string;
    stroke: string;
  };
};

export function arc({
  ctx,
  x,
  y,
  radius,
  startAngle = 0,
  endAngle = Math.PI,
  counterclockwise,
  colors = { background: getPrimitiveWhite(), stroke: getPrimitiveBlue() },
  strokeWeight = STROKE_DEFAULT,
}: ArcArgs) {
  ctx.save();
  ctx.moveTo(x, y);

  ctx.beginPath();
  ctx.arc(
    x,
    y,
    radius,
    startAngle * Math.PI,
    endAngle * Math.PI,
    counterclockwise,
  );
  ctx.fillStyle = colors.background;
  ctx.fill();
  ctx.lineWidth = strokeWeight;
  ctx.strokeStyle = colors.stroke;
  ctx.stroke();

  ctx.restore();
}
