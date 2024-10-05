import { get, type Writable, writable } from "svelte/store";
import type { Vector } from "@fig/types/properties/Vector";

class CursorPosition {
  store: Writable<Vector>;

  constructor() {
    this.store = writable({ x: 0, y: 0 });
  }

  get x() {
    return get(this.store).x;
  }

  get y() {
    return get(this.store).y;
  }

  get pos() {
    return get(this.store);
  }

  public setPos(pos: Vector) {
    this.store.set(pos);
  }
}

export let cursorPosition = new CursorPosition();
