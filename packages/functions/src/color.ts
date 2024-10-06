import {Color} from "@fig/types/properties/color/Color";

/**
 * Color to string
 */
export function colorToString(color: Color): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}

/**
 * RGBColor to string
 */
export function rgbColorToString(color: Color): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function getPrimitiveBlue(): string {
  return "rgb(12, 140, 233)";
}

export function getPrimitiveWhite(): string {
  return "rgb(255, 255, 255)";
}
