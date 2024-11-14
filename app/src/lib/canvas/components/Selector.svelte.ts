import type { VectorPart } from "$lib/canvas/types/VectorPart";
import type { CanvasNode } from "$lib/canvas/types/CanvasNode";
import { Rect } from "$lib/canvas/Rect.svelte";
import { cursorPosition } from "$lib/stores";
import { canvasClick } from "$lib/canvas/stores/canvasClick.svelte";
import { canvasColors } from "$lib/canvas/stores/canvasColors";
import { keys } from "$lib/stores";
import { removeArrayOfTupleDuplicates } from "@fig/functions/array";
import type { Vector } from "@fig/types/properties/Vector";

class Selector {
  mode: "node" | "vector" = $state("node");
  nodes: CanvasNode[] = $state([]);
  parts: VectorPart[] = $state([]);

  // If true, the selector will only select vectorParts
  partsMode: boolean = $state(false);

  disabled: boolean = $state(false);
  inSelection: boolean = $state(false);
  rect: Rect | null = $state(null);
  origin: Vector | null = $state(null);

  constructor() {}

  draw(ctx: CanvasRenderingContext2D) {
    if (this.disabled) return;

    if (this.rect) {
      this.rect.drawTopLeft({
        ctx,
        colors: { stroke: canvasColors.blue },
        strokeWeight: 2,
      });
    }
  }

  // ################################
  // BEGIN UPDATE
  // ################################

  update() {
    if (this.disabled) return;

    // Check for dragging
    if (canvasClick.pressed) {
      // Create this
      if (this.origin == null) {
        this.origin = {
          x: cursorPosition.offsetX,
          y: cursorPosition.offsetY,
        };
      }

      if (!this.rect) {
        // Only create a selector rect if clicked somewhere (origin) and moved
        if (this.origin.x != cursorPosition.offsetX && this.origin.y != cursorPosition.offsetY) {
          // Allow to add selection with shift pressed
          if (!keys.shiftPressed()) {
            this.unselectAllParts();
          }
          this.inSelection = true;
          this.rect = new Rect({
            x: cursorPosition.offsetX,
            y: cursorPosition.offsetY,
            width: cursorPosition.offsetX - this.origin.x,
            height: cursorPosition.offsetY - this.origin.y,
          });
        }
      } else {
        this.rect.width = cursorPosition.offsetX - this.rect.x;
        this.rect.height = cursorPosition.offsetY - this.rect.y;
      }
    }

    // Remove the rect if not dragging anymore
    if (!canvasClick.pressed) {
      this.inSelection = false;
      this.rect = null;
      this.origin = null;
    }
  }

  // ################################
  // END UPDATE
  // ################################

  disable() {
    this.disabled = true;
  }

  enable() {
    this.disabled = false;
  }

  // Nodes
  isPartMultiSelectionNodes(node: CanvasNode): boolean {
    return this.nodes.includes(node) && this.nodes.length > 1;
  }

  hasSelectedNodes(): boolean {
    return this.nodes.length > 0;
  }

  get hasMultipleSelectedNodes(): boolean {
    return this.nodes.length > 1;
  }

  selectNode(node: CanvasNode) {
    node.selected = true;
    if (!this.nodeIsSelected(node)) {
      this.nodes.push(node);
    }
  }

  selectSingleNode(node: CanvasNode) {
    console.log("testouille");
    for (const node of this.nodes) {
      node.selected = false;
    }
    this.selectNode(node);
  }

  unselectNode(node: CanvasNode) {
    if (this.nodeIsSelected(node)) {
      this.nodes.splice(this.nodes.indexOf(node), 1);
    }
    node.selected = false;
  }

  unselectAllNodes() {
    for (const node of this.nodes) {
      node.selected = false;
    }
    this.nodes = [];
  }

  nodeIsSelected(node: CanvasNode) {
    return this.nodes.includes(node);
  }

  get selectedNode() {
    return this.nodes.at(0);
  }

  // Vector parts
  hasSelectedParts() {
    return this.parts.length > 0;
  }

  selectSinglePart(part: VectorPart) {
    this.unselectAllParts();
    this.selectPart(part);
  }

  selectPart(part: VectorPart) {
    if (!this.partIsSelected(part)) {
      if (part.type === "point") {
        this.partsMode = true;
      }
      part.selected = true;
      this.parts.push(part);
    }
  }

  unselectPart(part: VectorPart) {
    if (this.parts.includes(part)) {
      part.selected = false;
      this.parts.splice(this.parts.indexOf(part), 1);

      // check if a point in the selection to update partsMode state
      if (part.type === "point") {
        let hasPoint = this.parts.filter((part) => part.type === "point").length > 0;

        if (!hasPoint) {
          this.partsMode = false;
        }
      }
    }
  }

  unselectAllParts() {
    for (const part of this.parts) {
      part.selected = false;
    }
    this.parts = [];
    this.partsMode = false;
  }

  partIsSelected(part: VectorPart) {
    return this.parts.includes(part);
  }

  /**
   * This method returns a list of unique command tuples
   * It is used to move all the selected parts
   */
  selectedPartsCommandTuples(): [number, number][] {
    return removeArrayOfTupleDuplicates(this.parts.map((part) => part.commandTuplesList).flat());
  }
}

export const selector = new Selector();
