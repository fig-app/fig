import type { VectorPart } from "$lib/canvas/types/VectorPart";
import type { Geometries } from "$lib/canvas/components/vector/Geometries.svelte.js";

export type VectorContext = {
  register: (part: VectorPart) => void;
  unregister: (part: VectorPart) => void;

  setDraggedPart: (part: VectorPart) => void;
  resetDraggedPart: (from: VectorPart) => void;
  isDragged: (part: VectorPart) => boolean | null;

  // Array of geometries that contains path commands
  strokeGeometries: Geometries;

  updateVector: () => void;
};
