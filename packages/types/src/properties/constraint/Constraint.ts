// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ConstraintType } from "./ConstraintType";

/**
 * Sizing constraint for exports
 */
export type Constraint = { 
/**
 * Type of constraint to apply; string enum with potential values below
 * SCALE: Scale by value
 * WIDTH: Scale proportionally and set width to value
 * HEIGHT: Scale proportionally and set height to value
 */
constraint_type: ConstraintType, 
/**
 * See ctype property for effect of this field
 */
value: number, };