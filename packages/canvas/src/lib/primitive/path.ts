type PathArgs = {
  ctx: CanvasRenderingContext2D;
  path: Path2D;
  colors?: {
    background?: string;
    stroke?: string;
  };
  strokeWeight?: number;
};

export function drawPath({ ctx, path, colors, strokeWeight = 1 }: PathArgs) {
  if (!colors) {
    colors = { background: undefined, stroke: "#000" };
  }

  ctx.save();

  if (colors.background) {
    ctx.fillStyle = colors.background;
    ctx.fill(path);
  }

  if (colors.stroke) {
    ctx.strokeStyle = colors.stroke;
    ctx.lineWidth = strokeWeight;
    ctx.stroke(path);
  }

  ctx.restore();
}
