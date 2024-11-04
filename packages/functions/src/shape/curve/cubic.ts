import {Vector} from "@fig/types/properties/Vector";

/**
 * Computes a point on a cubic Bezier curve at parameter t
 * @param p0 - Start point
 * @param p1 - Control point 1
 * @param p2 - Control point 2
 * @param p3 - End point
 * @param t - Parameter (0 <= t <= 1)
 * @returns The point on the curve at parameter t
 */
function cubicBezierPoint(
  p0: Vector,
  p1: Vector,
  p2: Vector,
  p3: Vector,
  t: number,
): Vector {
  const oneMinusT = 1 - t;
  return {
    x:
      oneMinusT ** 3 * p0.x +
      3 * oneMinusT ** 2 * t * p1.x +
      3 * oneMinusT * t ** 2 * p2.x +
      t ** 3 * p3.x,
    y:
      oneMinusT ** 3 * p0.y +
      3 * oneMinusT ** 2 * t * p1.y +
      3 * oneMinusT * t ** 2 * p2.y +
      t ** 3 * p3.y,
  };
}

/**
 * Checks if the mouse is hovering over a cubic Bezier curve
 * @param pstart - Start point of the Bezier curve
 * @param cp1 - Control point 1 of the Bezier curve
 * @param cp2 - Control point 2 of the Bezier curve
 * @param pend - End point of the Bezier curve
 * @param mousePos - The position of the mouse
 * @param threshold - The maximum distance to consider the mouse as "hovering" over the curve
 * @param samples - The number of points to sample on the curve (more samples = better accuracy)
 * @returns Whether the mouse is hovering over the curve
 */
export function isCubicBezierHovered(
  pstart: Vector,
  cp1: Vector,
  cp2: Vector,
  pend: Vector,
  mousePos: Vector,
  threshold: number = 5, // Default threshold for hover detection
  samples: number = 100, // Default number of samples along the curve
): boolean {
  for (let i = 0; i <= samples; i++) {
    const tStart = 0.1;
    const tEnd = 0.9;
    const t = tStart + (tEnd - tStart) * (i / samples);
    const point = cubicBezierPoint(pstart, cp1, cp2, pend, t);

    // Calculate the distance between the mouse position and the point on the curve
    const dist = Math.sqrt(
      (point.x - mousePos.x) ** 2 + (point.y - mousePos.y) ** 2,
    );

    if (dist <= threshold) {
      return true; // The mouse is close enough to be considered "hovering"
    }
  }

  return false; // No points were close enough to the mouse
}
