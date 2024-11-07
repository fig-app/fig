import type { Vector } from "@fig/types/properties/Vector";

/**
 * Represent a line that can be curved (start command (point), end command (point), startControl, endControl)
 */
export type Line = {
  startTuple: [number, number];
  endTuple: [number, number];
  startControl: Vector;
  endControl: Vector;
};
