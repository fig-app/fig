import { Vector } from "@fig/types/properties/Vector";

export function hoverRect(
  cursorPosition: Vector,
  topLeft: Vector,
  width: number,
  height: number,
) {
  return (
    cursorPosition.x > topLeft.x &&
    cursorPosition.x < topLeft.x + width &&
    cursorPosition.y > topLeft.y &&
    cursorPosition.y < topLeft.y + height
  );
}
