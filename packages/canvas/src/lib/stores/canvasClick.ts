import { get, writable, type Writable } from "svelte/store";
import type { Vector } from "@fig/types/properties/Vector";

type CanvasClickStore = {
  single: boolean;
  double: boolean;
  pressed: boolean;
  clickPoint: Vector | null;
};

class CanvasClick {
  private store: Writable<CanvasClickStore>;

  constructor() {
    this.store = writable({
      single: false,
      double: false,
      pressed: false,
      clickPoint: null,
    });
  }

  get single() {
    return get(this.store).single;
  }

  get double() {
    return get(this.store).double;
  }

  get pressed() {
    return get(this.store).pressed;
  }

  get clickPoint() {
    let point = get(this.store).clickPoint;
    return point ? point : { x: 0, y: 0 };
  }

  public setClickPoint(point: Vector) {
    this.store.update((store) => {
      store.clickPoint = point;
      return store;
    });
  }

  public setSingleClick(click: boolean, point: Vector) {
    this.store.update((store) => {
      store.single = true;
      store.clickPoint = point;
      return store;
    });
  }

  public setDoubleClick(click: boolean, point: Vector) {
    this.store.update((store) => {
      store.double = click;
      store.clickPoint = point;
      return store;
    });
  }

  public setPress(click: boolean, point: Vector) {
    this.store.update((store) => {
      store.pressed = click;
      store.clickPoint = point;
      return store;
    });
  }

  public resetClick() {
    this.store.set({
      single: false,
      double: false,
      pressed: false,
      clickPoint: null,
    });
  }
}

export const canvasClick = new CanvasClick();
