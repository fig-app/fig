import type { Vector } from "@fig/types/dist/properties/Vector";

export type PathCommand = (
  | {
      type: "C" | "c";
      end_point: Vector;
      control_points: {
        start: Vector;
        end: Vector;
      };
    }
  | {
      type: "A" | "a";
      radii: Vector;
      rotation: number;
      large: boolean;
      clockwise: boolean;
      end_point: Vector;
    }
  | {
      type: "S" | "s" | "Q" | "q";
      end_point: Vector;
      control_point: Vector;
    }
  | {
      type: "M" | "m" | "L" | "l" | "T" | "t";
      end_point: Vector;
    }
  | {
      type: "H" | "h" | "V" | "v";
      value: number;
    }
  | {
      type: "Z";
    }
) & { relative: boolean };
