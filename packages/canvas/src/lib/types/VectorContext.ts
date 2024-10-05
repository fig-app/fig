import type { VectorPart } from "$lib/types/VectorPart";
import type { PathCommand } from "@fig/functions/path/PathCommand";

export type VectorContext = {
  register: (part: VectorPart) => void;
  unregister: (part: VectorPart) => void;
  setSelectedPart: (part: VectorPart | null) => void;
  setDraggedPart: (part: VectorPart | null, from?: VectorPart) => void;
  isDragged: (part: VectorPart) => boolean | null;
  geometries_commands: PathCommand[][];
};
