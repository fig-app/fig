import type { VectorPart } from "$lib/types/VectorPart";
import type { PathCommand } from "@fig/functions/path/PathCommand";

export type VectorContext = {
  register: (part: VectorPart) => void;
  unregister: (part: VectorPart) => void;

  setDraggedPart: (part: VectorPart) => void;
  resetDraggedPart: (from: VectorPart) => void;
  isDragged: (part: VectorPart) => boolean | null;

  strokeGeometriesCommands: PathCommand[][];

  updateVector: () => void;
};
