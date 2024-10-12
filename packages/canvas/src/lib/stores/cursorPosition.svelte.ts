import type { Vector } from "@fig/types/properties/Vector";
import { navigation } from "$lib/stores/navigation.svelte";

class CursorPosition {
  private state: Vector = $state({ x: 0, y: 0 });

  constructor() {}

  get x() {
    return this.state.x;
  }

  get y() {
    return this.state.y;
  }

  get virtualX() {
    return navigation.toVirtualX(this.state.x);
  }

  get virtualY() {
    return navigation.toVirtualY(this.state.y);
  }

  get pos() {
    return this.state;
  }

  set pos(value: Vector) {
    this.state = value;
  }

  get virtualPos() {
    return {
      x: navigation.toVirtualX(this.state.x),
      y: navigation.toVirtualY(this.state.y),
    };
  }
}

export let cursorPosition = new CursorPosition();
