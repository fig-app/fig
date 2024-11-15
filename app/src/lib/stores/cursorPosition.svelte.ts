import type {Vector} from "@fig/types/properties/Vector";

class CursorPosition {
  clientPos: Vector = $state({x: 0, y: 0});
  offsetPos: Vector = $state({x: 0, y: 0});

  constructor() {
    if (typeof window !== "undefined") {
      document.body.addEventListener("mousemove", this.handleMouseMove.bind(this));
    }
  }

  private handleMouseMove(e: MouseEvent) {
    this.clientPos = {x: e.clientX, y: e.clientY};
    this.offsetPos = {x: e.offsetX, y: e.offsetY};

    // When dragging and the cursor goes out of the window, bring it back to the other side
    if (this.clientPos.x > window.innerWidth - 5) {
    }
  }

  get x() {
    return this.clientPos.x;
  }

  get y() {
    return this.clientPos.y;
  }

  get offsetX() {
    return this.offsetPos.x;
  }

  get offsetY() {
    return this.offsetPos.y;
  }

  set pos(value: Vector) {
    this.clientPos = value;
  }

  get pos() {
    return this.clientPos;
  }
}

export let cursorPosition = new CursorPosition();
