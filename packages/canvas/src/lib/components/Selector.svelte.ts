import type {VectorPart} from "$lib/types/VectorPart";
import type {CanvasNode} from "$lib/types/CanvasNode";
import {Rect} from "../Rect.svelte.js";
import {cursorPosition} from "$lib/stores/cursorPosition.svelte.js";
import {canvasClick} from "$lib/stores/canvasClick.svelte.js";
import {canvasColors} from "$lib/stores/canvasColors";
import {keys} from "$lib/stores/keys.svelte.js";
import type {Vector} from "@fig/types/properties/Vector";
import {removeArrayOfTupleDuplicates} from "@fig/functions/array";

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

  constructor() {
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.disabled) return;

    if (this.rect) {
      this.rect.drawTopLeft({
        ctx,
        colors: {stroke: canvasColors.blue},
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
          x: cursorPosition.x,
          y: cursorPosition.y,
        };
      }

      if (!this.rect) {
        // Only create a selector rect if clicked somewhere (origin) and moved
        if (this.origin.x != cursorPosition.x && this.origin.y != cursorPosition.y) {
          // Allow to add selection with shift pressed
          if (!keys.shiftPressed()) {
            this.unselectAllParts();
          }
          this.inSelection = true;
          this.rect = new Rect({
            x: cursorPosition.x,
            y: cursorPosition.y,
            width: cursorPosition.x - this.origin.x,
            height: cursorPosition.y - this.origin.y,
          });
        }
      } else {
        this.rect.width = cursorPosition.x - this.rect.x;
        this.rect.height = cursorPosition.y - this.rect.y;
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

  // Nodes (for now not used functions)
  selectNode(node: CanvasNode) {
    if (!this.nodeIsSelected(node)) {
      node.selected = true;
      this.nodes.push(node);
    }
  }

  unselectNode(node: CanvasNode) {
    if (this.nodeIsSelected(node)) {
      node.selected = false;
      this.nodes.splice(this.nodes.indexOf(node), 1);
    }
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
        let hasPoint =
          this.parts.filter((part) => part.type === "point").length > 0;

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
    return removeArrayOfTupleDuplicates(
      this.parts.map((part) => part.commandTuplesList).flat(),
    );
  }
}

export const selector = new Selector();
