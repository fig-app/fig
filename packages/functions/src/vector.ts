import {Vector} from "@fig/types/properties/Vector";

/**
 * Serialize a vector {x,y} to string
 */
export function vectorToString(vec: Vector): string {
  return `${vec.x} ${vec.y}`;
}
