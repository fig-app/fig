import type { Node } from "@fig/types/nodes/Node";
import type { CanvasDrawFunction } from "$lib/canvas/types/CanvasFunction";
import type { Rect } from "$lib/canvas/Rect.svelte.js";
import type { Vector } from "@fig/types/properties/Vector";
import type { Horizontal, Side, Vertical } from "$lib/canvas/types/Axis";

export type CanvasNode = {
  draw: CanvasDrawFunction;
  update: () => void;
  move: (delta: Vector) => void;
  resize: {
    fromCorner: (vertical: Vertical, horizontal: Horizontal, position: Vector) => void;
    fromSide: (side: Side, position: Vector) => void;
  };

  node: Node;
  selected: boolean;
  boundingBox: Rect;
  position: Vector;
};
