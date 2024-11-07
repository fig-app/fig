import type {CanvasNode} from "$lib/types/CanvasNode";

type pipelineClassStateType = {
  pipeline: Set<CanvasNode>;
};

class pipelineClass {
  private states: pipelineClassStateType = $state({
    pipeline: new Set<CanvasNode>(),
  });

  constructor() {
  }

  get pipeline(): Set<CanvasNode> {
    return this.states.pipeline;
  }

  set addToPipeline(value: CanvasNode) {
    this.states.pipeline.add(value);
  }
}

export const canvasPipeline = new pipelineClass();
