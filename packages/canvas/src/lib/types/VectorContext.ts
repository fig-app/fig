import type { VectorPart } from "$lib/types/VectorPart";
import type { PathCommand } from "@fig/functions/path/PathCommand";

export type VectorContext = {
  register: (part: VectorPart) => void;
  unregister: (part: VectorPart) => void;

  setSelectedPart: (part: VectorPart | null) => void;

  setDraggedPart: (part: VectorPart) => void;
  resetDraggedPart: (from: VectorPart) => void;
  isDragged: (part: VectorPart) => boolean | null;

  stroke_geometries_commands: PathCommand[][];

  updateVector: () => void;
};
