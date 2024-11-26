import type { PathCommand } from "./PathCommand";
import { Vector } from "@fig/types/properties/Vector";

type BoundingBox = {
  min: Vector;
  max: Vector;
  center: Vector;
  width: number;
  height: number;
};

export function getGeometryBbox(geometries: PathCommand[][]): BoundingBox {
  let overallMinX = Infinity,
    overallMinY = Infinity,
    overallMaxX = -Infinity,
    overallMaxY = -Infinity;

  for (const geometry of geometries) {
    const { min, max } = getPathBbox(geometry);

    overallMinX = Math.min(overallMinX, min.x);
    overallMinY = Math.min(overallMinY, min.y);
    overallMaxX = Math.max(overallMaxX, max.x);
    overallMaxY = Math.max(overallMaxY, max.y);
  }

  // Calculate overall width and height
  const width = overallMaxX - overallMinX;
  const height = overallMaxY - overallMinY;

  return {
    min: { x: overallMinX, y: overallMinY },
    max: { x: overallMaxX, y: overallMaxY },
    center: { x: overallMinX + width / 2, y: overallMinY + height / 2 },
    width,
    height,
  };
}

export function getPathBbox(commands: PathCommand[]): BoundingBox {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  let currentX = 0,
    currentY = 0;

  const updateBounds = (x: number, y: number) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  };

  const applyRelative = (command: PathCommand, x: number, y: number) => {
    return command.relative ? { x: currentX + x, y: currentY + y } : { x, y };
  };

  for (const command of commands) {
    switch (command.type) {
      case "M":
      case "L":
      case "T": {
        const { x, y } = applyRelative(command, command.endPoint.x, command.endPoint.y);
        updateBounds(x, y);
        currentX = x;
        currentY = y;
        break;
      }
      case "H": {
        const x = command.relative ? currentX + command.value : command.value;
        updateBounds(x, currentY);
        currentX = x;
        break;
      }
      case "V": {
        const y = command.relative ? currentY + command.value : command.value;
        updateBounds(currentX, y);
        currentY = y;
        break;
      }
      case "C": {
        const cp1 = applyRelative(
          command,
          command.controlPoints.start.x,
          command.controlPoints.start.y,
        );
        const cp2 = applyRelative(
          command,
          command.controlPoints.end.x,
          command.controlPoints.end.y,
        );
        const ep = applyRelative(command, command.endPoint.x, command.endPoint.y);

        updateBounds(cp1.x, cp1.y);
        updateBounds(cp2.x, cp2.y);
        updateBounds(ep.x, ep.y);

        currentX = ep.x;
        currentY = ep.y;
        break;
      }
      case "S":
      case "Q": {
        const cp = applyRelative(command, command.controlPoint.x, command.controlPoint.y);
        const ep = applyRelative(command, command.endPoint.x, command.endPoint.y);

        updateBounds(cp.x, cp.y);
        updateBounds(ep.x, ep.y);

        currentX = ep.x;
        currentY = ep.y;
        break;
      }
      case "A": {
        const ep = applyRelative(command, command.endPoint.x, command.endPoint.y);
        // Approximation of bounding box based on radii and end points.
        const rx = command.radii.x;
        const ry = command.radii.y;

        updateBounds(currentX - rx, currentY - ry);
        updateBounds(currentX + rx, currentY + ry);
        updateBounds(ep.x, ep.y);

        currentX = ep.x;
        currentY = ep.y;
        break;
      }
      case "Z": {
        // No need to update the bounding box for 'Z' as it just closes the path
        break;
      }
    }
  }

  // Calculate width and height based on the bounding box
  const width = maxX - minX;
  const height = maxY - minY;

  return {
    min: { x: minX, y: minY },
    max: { x: maxX, y: maxY },
    center: { x: minX + width / 2, y: minY + height / 2 },
    width,
    height,
  };
}
