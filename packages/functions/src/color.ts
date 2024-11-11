import { Color } from "@fig/types/properties/color/Color";

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

/**
 * Convert rgb color to hex color
 */
export function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
}

/**
 * Convert hsl color to rgb color
 */
export function hslToRgb(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Convert rgb color to hsl color
 */
export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert hex color to rgb color
 */
export function hexToRgb(hex: string) {
  // Ensure hex is valid
  const cleanedHex = hex.replace(/^#/, "");
  if (cleanedHex.length !== 6 && cleanedHex.length !== 3) return null;

  // Expand shorthand hex format (#RGB) to full form (#RRGGBB)
  const fullHex =
    cleanedHex.length === 3
      ? cleanedHex
          .split("")
          .map((char) => char + char)
          .join("")
      : cleanedHex;

  const r = parseInt(fullHex.slice(0, 2), 16);
  const g = parseInt(fullHex.slice(2, 4), 16);
  const b = parseInt(fullHex.slice(4, 6), 16);

  return { r, g, b };
}

/**
 * Convert hex color to hsl color
 */
export function hexToHsl(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

/**
 * Convert hue rotation to hex color
 */
export function hueRotationToHex(
  hue: number,
  saturation = 100,
  lightness = 50,
) {
  const { r, g, b } = hslToRgb(hue % 360, saturation, lightness);
  return rgbToHex(r, g, b);
}

/**
 * Convert hue rotation to hsl color
 */
export function hueRotationToHsl(rotation: number) {
  return { h: rotation, s: 100, l: 50 };
}
