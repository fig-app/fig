import { Vector } from "@fig/types/dist/properties/Vector";
import { pointsDistance } from "./point";

const { abs, pow, sqrt } = Math;

type HoverLineArgs = {
  line: {
    start: Vector;
    end: Vector;
  };
  cursorPosition: Vector;
};

/**
 * Check if the cursor is on the mouse.
 */
export function hoverLine({ line, cursorPosition }: HoverLineArgs): boolean {
  if (pointToSegmentDistance({ line, point: cursorPosition }) < 5) {
    return true;
  }
  return false;
}

type PointToLineDistanceArgs = {
  line: {
    start: Vector;
    end: Vector;
  };
  point: Vector;
};

/**
 * Calculate the distance from a point to a line.
 */
export function pointToLineDistance({
  line: { start, end },
  point,
}: PointToLineDistanceArgs) {
  return (
    abs(
      (end.y - start.y) * point.x -
        (end.x - start.x) * point.y +
        end.x * start.y -
        end.y * start.x,
    ) / pointsDistance(start, end)
  );
}

/**
 * Calculate the distance from a point to a segment.
 * *
 * Made with help of this [stackoverflow answer](https://stackoverflow.com/a/6853926)
 */
export function pointToSegmentDistance({
  line: { start, end },
  point,
}: PointToLineDistanceArgs) {
  var A = point.x - start.x;
  var B = point.y - start.y;
  var C = end.x - start.x;
  var D = end.y - start.y;

  var dot = A * C + B * D;
  var len_sq = C * C + D * D;
  var param = -1;
  if (len_sq != 0)
    //in case of 0 length line
    param = dot / len_sq;

  var xx, yy;

  if (param < 0) {
    xx = start.x;
    yy = start.y;
  } else if (param > 1) {
    xx = end.x;
    yy = end.y;
  } else {
    xx = start.x + param * C;
    yy = start.y + param * D;
  }

  var dx = point.x - xx;
  var dy = point.y - yy;

  return sqrt(dx * dx + dy * dy);
}
