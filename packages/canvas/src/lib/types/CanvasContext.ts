import type { CanvasNode } from "./CanvasNode";

export type CanvasContext = {
  register: (node: CanvasNode) => void;
  unregister: (node: CanvasNode) => void;
  updateCanvas: (depts: () => any[]) => void;
  redraw: () => void;
};
