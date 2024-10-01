import {RGBColorType} from "./RGBColorType";

/**
 * An RBG Color
 */
export class RGBColor {
  r: number;
  g: number;
  b: number;

  constructor({ r, g, b }: RGBColorType) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  public toString(): string {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }

  public toObject(): RGBColorType {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
    };
  }
}
