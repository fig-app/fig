import { PathCommand } from "./PathCommand";
import { Vector } from "@fig/types/properties/Vector";

export function serializeCommands(commands: PathCommand[]): string {
  let path = "";

  for (let command of commands) {
    path += command.type;

    switch (command.type) {
      // Move commands
      case "m":
      case "M":
      // Line commands
      case "l":
      case "L":
      // Quadratic bézier curve
      case "t":
      case "T":
        path += " " + serializeVector(command.endPoint);
        break;
      // Cubic bézier curve
      case "c":
      case "C":
        path +=
          " " +
          serializeVector(command.controlPoints.start) +
          " " +
          serializeVector(command.controlPoints.end) +
          " " +
          serializeVector(command.endPoint);
        break;
      // Horizontal line
      case "h":
      case "H":
      // Vertical line
      case "v":
      case "V":
        path += ` ${command.value}`;
        break;
    }

    if (command.type !== "Z") {
      path += " ";
    }
  }

  return path;
}

function serializeVector(vector: Vector) {
  return `${vector.x} ${vector.y}`;
}
