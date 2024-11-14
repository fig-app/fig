import type { VectorPart } from "$lib/canvas/types/VectorPart";
import type { PathCommand } from "@fig/functions/path/PathCommand";

export type VectorContext = {
  register: (part: VectorPart) => void;
  unregister: (part: VectorPart) => void;

  setDraggedPart: (part: VectorPart) => void;
  resetDraggedPart: (from: VectorPart) => void;
  isDragged: (part: VectorPart) => boolean | null;

  // Array of geometries that contains path commands
  strokeGeometriesCommands: PathCommand[][];

  updateVector: () => void;
};
