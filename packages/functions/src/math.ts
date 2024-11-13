export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function roundFloat(float: number, dec: number): number {
  return Math.round(float * Math.pow(10, dec)) / Math.pow(10, dec);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
