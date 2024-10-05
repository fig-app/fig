import type { DocumentNode } from "./DocumentNode";
import type { EmptyData } from "./vector/EmptyData";
import type { RectangleData } from "./vector/RectangleData";
import type { VectorNode } from "./vector/VectorNode";
import { CanvasNode } from "./CanvasNode";

export type NodeType =
  | DocumentNodeType
  | CanvasNodeType
  | VectorNodeType
  | RectangleNodeType;

export type DocumentNodeType = { type: "document"; data: DocumentNode };
export type CanvasNodeType = { type: "canvas"; data: CanvasNode };
export type VectorNodeType = { type: "vector"; data: VectorNode<EmptyData> };
export type RectangleNodeType = {
  type: "rectangle";
  data: VectorNode<RectangleData>;
};
