import type { Vector } from "@fig/types/properties/Vector";

class CursorPositionSvelte {
  private state: Vector = $state({ x: 0, y: 0 });

  constructor() {}

  get x() {
    return this.state.x;
  }

  get y() {
    return this.state.y;
  }

  get pos() {
    return this.state;
  }

  set pos(value: Vector) {
    this.state = value;
  }
}

export let cursorPosition = new CursorPositionSvelte();
