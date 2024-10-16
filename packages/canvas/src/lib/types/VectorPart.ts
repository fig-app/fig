import type {CanvasDrawFunction} from "$lib/types/CanvasFunction";
import type {PathCommandWithEndPoint} from "@fig/functions/path/PathCommand";

/**
 * Represents a part of a vector when it is in edit mode.
 *
 * There are three type of vector part : point, line and curve.
 */
export type VectorPart = {
  id: string;
  type: "point" | "line" | "curve";
  commands: PathCommandWithEndPoint[];

  draw: CanvasDrawFunction;
  update: () => void;

  selected: boolean;
};
