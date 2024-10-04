import type { CanvasDrawFunction } from "$lib/types/CanvasFunction";

export type VectorPart = {
  type: "point" | "line";
  draw: CanvasDrawFunction;
  update: () => void;
  hovered: boolean;
};
