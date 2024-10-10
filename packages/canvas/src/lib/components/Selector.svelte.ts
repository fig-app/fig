import type { VectorPart } from "$lib/types/VectorPart";
import type { CanvasNode } from "$lib/types/CanvasNode";
import { Rect } from "$lib/Rect.svelte";
import { getPrimitiveBlue } from "@fig/functions/color";
import { cursorPosition } from "$lib/stores/cursorPosition.svelte";
import { canvasClick } from "$lib/stores/canvasClick.svelte";

type SelectorStates = {
  mode: "node" | "vector";
  disabled: boolean;
  nodes: CanvasNode[];
  parts: VectorPart[];
};

class Selector {
  states: SelectorStates = $state({
    mode: "node",
    disabled: false,
    nodes: [],
    parts: [],
  });
  inSelection: boolean = $state(false);
  rect: Rect | null = $state(null);

  constructor() {}

  draw(ctx: CanvasRenderingContext2D) {
    if (this.states.disabled) return;

    if (this.rect) {
      this.rect.drawTopLeft({
        ctx,
        colors: { stroke: getPrimitiveBlue() },
        strokeWeight: 2,
      });
    }
  }

  update() {
    if (this.states.disabled) return;

    // Create a rect
    if (canvasClick.pressed && !this.rect) {
      this.inSelection = true;
      this.rect = new Rect({
        x: cursorPosition.x,
        y: cursorPosition.y,
        width: 0,
        height: 0,
      });
    }

    // Remove the rect
    if (!canvasClick.pressed && this.rect) {
      this.inSelection = false;
      this.rect = null;
    }

    // Update the rect
    if (this.rect) {
      this.rect.width = cursorPosition.x - this.rect.x;
      this.rect.height = cursorPosition.y - this.rect.y;
    }
  }

  disable() {
    this.states.disabled = true;
  }

  enable() {
    this.states.disabled = false;
  }

  // Nodes

  select(node: CanvasNode) {
    if (!this.nodeIsSelected(node)) {
      node.selected = true;
      this.states.nodes.push(node);
    }
  }

  unselect(node: CanvasNode) {
    if (this.nodeIsSelected(node)) {
      node.selected = false;
      this.states.nodes.splice(this.states.nodes.indexOf(node), 1);
    }
  }

  unselectAll() {
    for (const node of this.states.nodes) {
      node.selected = false;
    }
    this.states.nodes = [];
  }

  nodeIsSelected(node: CanvasNode) {
    return this.states.nodes.includes(node);
  }

  // Vector parts

  selectSinglePart(part: VectorPart) {
    this.unselectAllParts();
    this.selectPart(part);
  }

  selectPart(part: VectorPart) {
    if (!this.partIsSelected(part)) {
      part.selected = true;
      this.states.parts.push(part);
    }
  }

  unselectPart(part: VectorPart) {
    if (this.states.parts.includes(part)) {
      part.selected = false;
      this.states.parts.splice(this.states.parts.indexOf(part), 1);
    }
  }

  unselectAllParts() {
    for (const part of this.states.parts) {
      part.selected = false;
    }
    this.states.parts = [];
  }

  partIsSelected(part: VectorPart) {
    return this.states.parts.includes(part);
  }
}

export const selector = new Selector();
