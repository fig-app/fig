import type { Vector } from "@fig/types/properties/Vector";
import type { PathCommand } from "@fig/functions/path/PathCommand";

type OffsetStore = {
  offsetX: number;
  offsetY: number;
  scale: number;
  cellSize: number;
};

class NavigationSvelte {
  private states: OffsetStore = $state({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    cellSize: 10,
  });

  constructor() {}

  get scale(): number {
    return this.states.scale;
  }

  get percentScale(): number {
    return this.scale * 100;
  }

  set scale(value: number) {
    this.states.scale = value;
  }

  get offsetX(): number {
    return this.states.offsetX;
  }

  set offsetX(value: number) {
    this.states.offsetX = value;
  }

  get offsetY(): number {
    return this.states.offsetY;
  }

  set offsetY(value: number) {
    this.states.offsetY = value;
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

  toRealPoint(point: Vector) {
    return {
      x: this.toRealX(point.x),
      y: this.toRealY(point.y),
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

export const navigation = new NavigationSvelte();
