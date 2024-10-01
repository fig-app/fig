import type { VectorPart } from "$lib/types/VectorPart";

export type VectorContext = {
  register: (part: VectorPart) => void;
  unregister: (part: VectorPart) => void;
};
