import type { VectorPart } from "$lib/types/VectorPart";
import type { PathCommand } from "@fig/functions/path/PathCommand";

export type VectorContext = {
  register: (part: VectorPart) => void;
  unregister: (part: VectorPart) => void;
  geometries_commands: PathCommand[][];
};
