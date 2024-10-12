import type { CPathCommand, MLTPathCommand } from "./PathCommand";

export function commandHasEndPoint(
  command: any,
): command is MLTPathCommand | CPathCommand {
  return "endPoint" in command;
}

export function isMLTPathCommand(command: any): command is MLTPathCommand {
  return "endPoint" in command && !("controlPoints" in command);
}

export function isCPathCommand(command: any): command is CPathCommand {
  return "controlPoints" in command;
}
