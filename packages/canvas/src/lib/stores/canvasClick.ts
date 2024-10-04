import { get, writable, type Writable } from "svelte/store";

class CanvasClick {
  private store: Writable<boolean>;

  constructor() {
    this.store = writable(false);
  }

  get clicked() {
    return get(this.store);
  }

  public setClick(click: boolean) {
    this.store.set(click);
  }
}

export const canvasClick = new CanvasClick();
