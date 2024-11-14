import type { CanvasContext } from "$lib/canvas/types/CanvasContext";
import { getContext, onDestroy, setContext } from "svelte";
import type { CanvasNode } from "$lib/canvas/types/CanvasNode";

export const CANVAS_KEY = Symbol("CANVAS");

export function setCanvasContext(context: CanvasContext) {
  setContext<CanvasContext>(CANVAS_KEY, context);
}

export function getCanvasContext(): CanvasContext {
  return getContext<CanvasContext>(CANVAS_KEY);
}

export function registerCanvasNode(node: CanvasNode) {
  let context = getCanvasContext();
  context.register(node);

  onDestroy(() => {
    context.unregister(node);
  });
}
