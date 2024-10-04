import type { CanvasDrawFunction } from "$lib/types/CanvasFunction";

export type VectorPart = {
  id: string;
  type: "point" | "line";
  draw: CanvasDrawFunction;
  update: () => void;
  selected: boolean;
};
