import {Vector} from "../properties/Vector";

export type Curve = {
  start: Vector;
  end: Vector;
  startControl: Vector;
  endControl: Vector;
};
