import {Vector} from "@fig/types/properties/Vector";

type isCursorHoveringArcArgs = {
  cursorPosition: Vector;
  arc : {
    centerPosition: Vector;
    radius: number;
  }
}

// We use Pythagorean theorem to know if a point is in the radius of a circle (arc)
export function isCursorHoveringArc({cursorPosition, arc} : isCursorHoveringArcArgs) {
  const dx = cursorPosition.x - arc.centerPosition.x;
  const dy = cursorPosition.y - arc.centerPosition.y;
  const distanceSquared = dx * dx + dy * dy;
  const radiusSquared = arc.radius * arc.radius;

  // Check if the cursor is within the radius
  return distanceSquared < radiusSquared;
}
