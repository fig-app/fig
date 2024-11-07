import type { CanvasDrawFunction } from "$lib/types/CanvasFunction";

/**
 * Represents a part of a vector when it is in edit mode.
 *
 * There are four types of vector part : point, line, curve and control point.
 */
export type VectorPart = {
  id: string;

  // List of command that are associated with their geometry index.
  // First number is the index of the geometry, second number is the index of the command.
  commandTuplesList: [number, number][];

  type: "point" | "line" | "curve" | "controlPoint";

  draw: CanvasDrawFunction;
  update: () => void;

  selected: boolean;
};
