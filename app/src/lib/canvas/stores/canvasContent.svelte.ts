import type { CanvasNode } from "$lib/canvas/types/CanvasNode";

export let nodes: Set<CanvasNode> = $state(new Set());
