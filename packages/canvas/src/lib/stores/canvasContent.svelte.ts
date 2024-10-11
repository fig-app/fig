import type { CanvasNode } from "$lib/types/CanvasNode";
import type { VectorPart } from "$lib/types/VectorPart";

export let nodes: Set<CanvasNode> = $state(new Set());

export let vectorParts: Set<VectorPart> = $state(new Set());
