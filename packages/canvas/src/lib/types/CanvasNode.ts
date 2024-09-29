
import type {Node} from "@fig/types/Node";

export type CanvasDrawFunction = (ctx: CanvasRenderingContext2D) => void;

export type CanvasNode = {
    draw: CanvasDrawFunction,
    node: Node
}
