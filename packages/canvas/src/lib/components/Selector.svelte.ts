import type { VectorPart } from "$lib/types/VectorPart";
import type { CanvasNode } from "$lib/types/CanvasNode";
import { Rect } from "$lib/Rect.svelte";
import { cursorPosition } from "$lib/stores/cursorPosition.svelte";
import { canvasClick } from "$lib/stores/canvasClick.svelte";
import { removeDuplicates } from "@fig/functions/array";
import { canvasColors } from "$lib/stores/canvasColors";

class Selector {
  mode: "node" | "vector" = $state("node");
  nodes: CanvasNode[] = $state([]);
  parts: VectorPart[] = $state([]);

  // If true, the selector will only select point
  // of vector (and also lines between two points)
  pointMode: boolean = $state(false);

  disabled: boolean = $state(false);
  inSelection: boolean = $state(false);
  rect: Rect | null = $state(null);

  constructor() {}

  draw(ctx: CanvasRenderingContext2D) {
    if (this.disabled) return;

    if (this.rect) {
      this.rect.drawTopLeft({
        ctx,
        colors: { stroke: canvasColors.blue },
        strokeWeight: 1,
      });
    }
  }

  update() {
    if (this.disabled) return;

    // Create a rect
    if (canvasClick.pressed && !this.rect) {
      this.unselectAllParts();
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
    this.disabled = true;
  }

  enable() {
    this.disabled = false;
  }

  // Nodes

  select(node: CanvasNode) {
    if (!this.nodeIsSelected(node)) {
      node.selected = true;
      this.nodes.push(node);
    }
  }

  unselect(node: CanvasNode) {
    if (this.nodeIsSelected(node)) {
      node.selected = false;
      this.nodes.splice(this.nodes.indexOf(node), 1);
    }
  }

  unselectAll() {
    for (const node of this.nodes) {
      node.selected = false;
    }
    this.nodes = [];
  }

  nodeIsSelected(node: CanvasNode) {
    return this.nodes.includes(node);
  }

  // Vector parts

  selectSinglePart(part: VectorPart) {
    this.unselectAllParts();
    this.selectPart(part);
  }

  selectPart(part: VectorPart) {
    if (!this.partIsSelected(part)) {
      if (part.type === "point") {
        this.pointMode = true;
      }
      part.selected = true;
      this.parts.push(part);
    }
  }

  unselectPart(part: VectorPart) {
    if (this.parts.includes(part)) {
      part.selected = false;
      this.parts.splice(this.parts.indexOf(part), 1);

      // check if a point in the selection to update point mode
      if (part.type === "point") {
        let hasPoint =
          this.parts.filter((part) => part.type === "point").length > 0;

        if (!hasPoint) {
          this.pointMode = false;
        }
      }
    }
  }

  unselectAllParts() {
    for (const part of this.parts) {
      part.selected = false;
    }
    this.parts = [];
    this.pointMode = false;
  }

  partIsSelected(part: VectorPart) {
    return this.parts.includes(part);
  }

  selectedPartsCommandsIndex(): number[] {
    return removeDuplicates(
      this.parts.map((part) => part.commandsIndex).flat(),
    );
  }
}

export const selector = new Selector();
