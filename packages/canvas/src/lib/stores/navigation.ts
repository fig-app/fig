import { get, writable, type Writable } from "svelte/store";
import type { Vector } from "@fig/types/properties/Vector";
import type { PathCommand } from "@fig/functions/path/PathCommand";

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

  toVirtualGeometryCommand(geometryCommands: PathCommand[]): PathCommand[] {
    let to_ret: PathCommand[] = [];

    for (let command of geometryCommands) {
      switch (command.type) {
        case "T":
        case "L":
        case "M": {
          to_ret.push({
            type: command.type,
            endPoint: this.toVirtualPoint(command.endPoint),
            relative: command.relative,
          });
          break;
        }
        case "Z": {
          to_ret.push({
            type: command.type,
            relative: command.relative,
          });
          break;
        }
      }
    }

    return to_ret;
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
