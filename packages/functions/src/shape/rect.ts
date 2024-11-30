import { Vector } from "@fig/types/properties/Vector";

export function hoverRect(
  cursorPosition: Vector,
  topLeft: Vector,
  width: number,
  height: number,
  distance: number = 0,
) {
  return (
    cursorPosition.x > topLeft.x - distance &&
    cursorPosition.x < topLeft.x + width + distance &&
    cursorPosition.y > topLeft.y - distance &&
    cursorPosition.y < topLeft.y + height + distance
  );
}
