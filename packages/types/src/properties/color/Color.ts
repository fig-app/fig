import {ColorType} from "./ColorType";

/**
 * An RGBA color
 */
export class Color {
  r: number = 0;
  g: number = 0;
  b: number = 0;
  a: number = 1;

  constructor({ r, g, b, a }: ColorType) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  public toString(): string {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  public toObject(): ColorType {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
      a: this.a,
    };
  }
}
