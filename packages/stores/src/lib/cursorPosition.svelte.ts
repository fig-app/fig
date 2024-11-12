import type { Vector } from "@fig/types/properties/Vector";

class CursorPosition {
  private state: Vector = $state({ x: 0, y: 0 });

  constructor() {
    if (typeof window !== "undefined") {
      document.body.addEventListener(
        "mousemove",
        this.handleMouseMove.bind(this),
      );
    }
  }

  private handleMouseMove(e: MouseEvent) {
    this.state = { x: e.clientX, y: e.clientY };
  }

  get x() {
    return this.state.x;
  }

  get y() {
    return this.state.y;
  }

  set pos(value: Vector) {
    this.state = value;
  }

  get pos() {
    return this.state;
  }
}

export let cursorPosition = new CursorPosition();
