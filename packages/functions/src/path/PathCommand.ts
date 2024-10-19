import type {Vector} from "@fig/types/properties/Vector";

export type PathCommand = (
  | CPathCommand
  | APathCommand
  | SQPathCommand
  | MLTPathCommand
  | HVPathCommand
  | ZPathCommand
  ) & { relative: boolean };

export interface CPathCommand {
  type: "C" | "c";
  endPoint: Vector;
  controlPoints: {
    start: Vector;
    end: Vector;
  };
}

export interface APathCommand {
  type: "A" | "a";
  radii: Vector;
  rotation: number;
  large: boolean;
  clockwise: boolean;
  endPoint: Vector;
}

export interface SQPathCommand {
  type: "S" | "s" | "Q" | "q";
  endPoint: Vector;
  controlPoint: Vector;
}

export interface MLTPathCommand {
  type: "M" | "m" | "L" | "l" | "T" | "t";
  endPoint: Vector;
}

export interface HVPathCommand {
  type: "H" | "h" | "V" | "v";
  value: number;
}

export interface ZPathCommand {
  type: "Z";
}

export type PathCommandWithEndPoint = (
  | CPathCommand
  | APathCommand
  | SQPathCommand
  | MLTPathCommand
  ) & { relative: boolean };

export interface HasEndPoint {
  endPoint: Vector;
}
