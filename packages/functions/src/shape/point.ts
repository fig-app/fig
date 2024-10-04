import { Vector } from "@fig/types/properties/Vector";

const { abs, pow, sqrt } = Math;

export function pointsDistance(p1: Vector, p2: Vector) {
  return sqrt(pow(p2.x - p1.x, 2) + pow(p2.y - p1.y, 2));
}

// export function vectorFromPoint(p1: Vector, p2: Vector): Vector {
//   return {
//     x:
//   }
// }