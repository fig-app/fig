import Vector from "$lib/components/Vector/Vector.svelte";

type CubicCurveArgs = {
  ctx: CanvasRenderingContext2D;
  startPoint: Vector;
  startControlPoint: Vector;
  endControlPoint: Vector;
  endPoint: Vector;
  color?: string;
  weight?: number;
};

export function cubicCurve({
                             ctx,
                             startPoint,
                             startControlPoint,
                             endControlPoint,
                             endPoint,
                             color = "#fff",
                             weight = 1,
                           }: CubicCurveArgs) {
  ctx.save();

  ctx.lineWidth = weight;
  ctx.strokeStyle = color;

  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.bezierCurveTo(
    startControlPoint.x,
    startControlPoint.y,
    endControlPoint.x,
    endControlPoint.y,
    endPoint.x,
    endPoint.y,
  );
  ctx.stroke();

  ctx.restore();
}
