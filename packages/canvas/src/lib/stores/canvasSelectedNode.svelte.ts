import type { CanvasNode } from "$lib/types/CanvasNode";

class CanvasSelectedNodes {
  private nodes: CanvasNode[] = $state([]);

  constructor() {}

  select(node: CanvasNode) {
    if (!this.nodes.includes(node)) {
      node.selected = true;
      this.nodes.push(node);
    }
  }

  unselect(node: CanvasNode) {
    if (this.nodes.includes(node)) {
      node.selected = false;
      this.nodes.splice(this.nodes.indexOf(node), 1);
    }
  }

  unselectAll() {
    this.nodes = [];
  }
}

export const canvasSelectedNodes = new CanvasSelectedNodes();
