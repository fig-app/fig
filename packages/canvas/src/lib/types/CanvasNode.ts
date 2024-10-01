import type { Node } from "@fig/types/nodes/Node";
import type { CanvasDrawFunction } from "$lib/types/CanvasFunction";

export type CanvasNode = {
  draw: CanvasDrawFunction;
  node: Node;
};