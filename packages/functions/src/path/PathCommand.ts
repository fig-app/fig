import type { Vector } from "@fig/types/properties/Vector";

export type PathCommand = (
  | CPathCommand
  | APathCommand
  | SQPathCommand
  | MLTPathCommand
  | HVPathCommand
  | ZPathCommand
) & { relative: boolean };

export type CPathCommand = {
  type: "C" | "c";
  endPoint: Vector;
  controlPoints: {
    start: Vector;
    end: Vector;
  };
};

export type APathCommand = {
  type: "A" | "a";
  radii: Vector;
  rotation: number;
  large: boolean;
  clockwise: boolean;
  endPoint: Vector;
};

export type SQPathCommand = {
  type: "S" | "s" | "Q" | "q";
  endPoint: Vector;
  controlPoint: Vector;
};

export type MLTPathCommand = {
  type: "M" | "m" | "L" | "l" | "T" | "t";
  endPoint: Vector;
};

export type HVPathCommand = {
  type: "H" | "h" | "V" | "v";
  value: number;
};

export type ZPathCommand = {
  type: "Z";
};
