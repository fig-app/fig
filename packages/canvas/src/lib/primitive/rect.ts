type RectArgs = {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  colors: {
    background: string | null;
    stroke: string | null;
  };
  strokeWeight: number;
  radius: number | number[];
};

type FillRectArgs = {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

type StrokeRectArgs = {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
};

export function rect({
  ctx,
  x,
  y,
  width,
  height,
  colors,
  strokeWeight,
  radius,
}: RectArgs) {
  ctx.save();

  ctx.translate(x, y);

  ctx.lineWidth = strokeWeight;
  if (colors.background) {
    ctx.fillStyle = colors.background;
  }
  if (colors.stroke) {
    ctx.strokeStyle = colors.stroke;
  }

  let startX = -width / 2;
  let startY = -height / 2;

  // draw rounded rect
  if (
    (typeof radius === "number" && radius > 0) ||
    (Array.isArray(radius) && radius.length > 0)
  ) {
    ctx.beginPath();
    ctx.roundRect(startX, startY, width, height, radius);
    if (colors.background) {
      ctx.fill();
    }
    if (colors.stroke) {
      ctx.stroke();
    }
  } else {
    if (colors.background) {
      ctx.fillRect(startX, startY, width, height);
    }
    if (colors.stroke) {
      ctx.strokeRect(startX, startY, width, height);
    }
  }

  ctx.restore();
}

export function fillRect({ ctx, x, y, width, height, color }: FillRectArgs) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = color;
  ctx.fillRect(-width / 2, -height / 2, width, height);

  ctx.restore();
}

export function strokeRect({
  ctx,
  x,
  y,
  width,
  height,
  color,
  strokeWidth,
}: StrokeRectArgs) {
  ctx.save();

  ctx.translate(x, y);

  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = color;

  ctx.strokeRect(-width / 2, -height / 2, width, height);

  ctx.restore();
}
