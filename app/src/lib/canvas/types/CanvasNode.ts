import type { Node } from "@fig/types/nodes/Node";
import type { CanvasDrawFunction } from "$lib/canvas/types/CanvasFunction";
import type { Rect } from "$lib/canvas/Rect.svelte.js";
import type { Vector } from "@fig/types/properties/Vector";

export type CanvasNode = {
  draw: CanvasDrawFunction;
  update: () => void;
  move: (delta: Vector) => void;
  node: Node;
  selected: boolean;
  boundingBox: Rect;
  position: Vector;
};
