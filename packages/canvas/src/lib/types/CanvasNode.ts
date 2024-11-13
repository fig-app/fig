import type { Node } from "@fig/types/nodes/Node";
import type { CanvasDrawFunction } from "$lib/types/CanvasFunction";
import type { Rect } from "../Rect.svelte.js";
import type { Vector } from "@fig/types/properties/Vector";

export type CanvasNode = {
  draw: CanvasDrawFunction;
  update: () => void;
  node: Node;
  selected: boolean;
  boundingBox: Rect;
  position: Vector;
};
