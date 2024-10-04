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
  ctx.translate(x, y);

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
  ctx.translate(x, y);

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
  strokeWeight: number;
  colors: {
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
  endAngle = 2,
  counterclockwise,
  colors,
  strokeWeight,
}: ArcArgs) {
  ctx.save();
  ctx.translate(x, y);

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
