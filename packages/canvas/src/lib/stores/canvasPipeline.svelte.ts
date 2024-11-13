import type { CanvasNode } from "$lib/types/CanvasNode";

type pipelineClassStateType = {
  pipeline: Set<CanvasNode>;
};

class pipelineClass {
  private pipeline = $state(new Set<CanvasNode>());

  constructor() {}

  set addNode(node: CanvasNode) {
    this.pipeline.add(node);
  }
}

export const canvasPipeline = new pipelineClass();
