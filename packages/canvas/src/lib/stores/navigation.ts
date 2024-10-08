import { get, writable, type Writable } from "svelte/store";
import type { Vector } from "@fig/types/properties/Vector";

type OffsetStore = {
  offsetX: number;
  offsetY: number;
  scale: number;
  cellSize: number;
};

class Navigation {
  store: Writable<OffsetStore>;

  constructor() {
    this.store = writable({
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      cellSize: 10,
    });
  }

  get scale(): number {
    return get(this.store).scale;
  }

  set scale(value: number) {
    this.store.update((store) => {
      store.scale = value;
      return store;
    });
  }

  get offsetX(): number {
    return get(this.store).offsetX;
  }

  set offsetX(value: number) {
    this.store.update((store) => {
      store.offsetX = value;
      return store;
    });
  }

  get offsetY(): number {
    return get(this.store).offsetY;
  }

  set offsetY(value: number) {
    this.store.update((store) => {
      store.offsetY = value;
      return store;
    });
  }

  toVirtualPoint(point: Vector) {
    return {
      x: this.toVirtualX(point.x),
      y: this.toVirtualY(point.y),
    };
  }

  toVirtualX(xReal: number): number {
    return (xReal + this.offsetX) * this.scale;
  }

  toVirtualY(yReal: number): number {
    return (yReal + this.offsetY) * this.scale;
  }

  toRealX(xVirtual: number): number {
    return xVirtual / this.scale - this.offsetX;
  }

  toRealY(yVirtual: number): number {
    return yVirtual / this.scale - this.offsetY;
  }
}

export const navigation = new Navigation();
