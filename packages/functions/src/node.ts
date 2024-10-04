import type { Node } from "@fig/types/dist/nodes/Node";

export function isDocument(node: Node) {
  return node.node.type === "document";
}

export function isVector(node: Node) {
  return node.node.type === "vector";
}

export function isCanvas(node: Node) {
  return node.node.type === "canvas";
}
