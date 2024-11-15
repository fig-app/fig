import type {CanvasNode} from "@fig/types/nodes/CanvasNode";
import {Rect} from "$lib/canvas/Rect.svelte";
import {getGeometryBbox} from "@fig/functions/dist/src/path/bBox";
import {navigation} from "$lib/canvas/stores/navigation.svelte";

type selectedGroupType = {
  nodes: Array<CanvasNode>,
  boundingBox: Rect,
};

class SelectedGroup {
  private states: selectedGroupType = $state({
    nodes: [],
    boundingBox: Rect.new(),
  });

  constructor() {
    let bbox = $derived(getGeometryBbox(strokeGeometriesCommands));
  }

  get nodes(): Array<CanvasNode> {
    return this.states.nodes;
  }

  add(node: CanvasNode) {
    if (!this.states.nodes.includes(node)) {
      this.states.nodes.push(node);
    }
    this.update();
  }

  remove(node: CanvasNode) {
    if (this.states.nodes.includes(node)) {
      this.states.nodes.splice(this.states.nodes.indexOf(node), 1);
    }
    this.update();
  }

  // Update the bounding box
  update() {
    this.states.boundingBox.update(0, 0, 0, 0);
  }
}

export const selectedGroup = new SelectedGroup();
