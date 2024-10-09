import { getContext, onDestroy, setContext } from "svelte";
import type { VectorContext } from "$lib/types/VectorContext";
import type { VectorPart } from "$lib/types/VectorPart";

const VECTOR_KEY = Symbol("VECTOR");

export function setVectorContext(context: VectorContext) {
  setContext<VectorContext>(VECTOR_KEY, context);
}

export function getVectorContext(): VectorContext {
  return getContext<VectorContext>(VECTOR_KEY);
}

export function registerVectorPart(part: VectorPart) {
  let context = getVectorContext();

  context.register(part);

  onDestroy(() => {
    context.unregister(part);
  });
}
