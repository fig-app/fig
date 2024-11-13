type CanvasContextType = {
  ctx: null | CanvasRenderingContext2D,
};

class CanvasContext {
  private states: CanvasContextType = $state({
    ctx: null,
  });

  constructor() {
  }

  get ctx(): CanvasRenderingContext2D | null {
    return this.states.ctx;
  }

  set ctx(ctx: CanvasRenderingContext2D | null) {
    this.states.ctx = ctx;
  }
}

export const canvasRenderingContext = new CanvasContext();
