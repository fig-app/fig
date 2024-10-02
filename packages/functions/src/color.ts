import {ColorType} from "@fig/types/dist/properties/color/ColorType";

/**
 * Color to string
 */
export function colorToString(color: ColorType): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}

/**
 * RGBColor to string
 */
export function rgbColorToString(color: ColorType): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}
