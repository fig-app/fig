import { Geometry } from "$lib/canvas/components/vector/Geometry.svelte.js";
import { getGeometryBbox } from "@fig/functions/path/bBox";

/**
 * A geometry contains multiple paths that represent a single shape.
 */
export class Geometries {
  geometries: Geometry[] = $state([]);

  translate: { x: number; y: number } = { x: 0, y: 0 };
  rotation: number = 0;
  scale: number = 1;

  constructor(paths: string[]) {
    this.geometries = paths.map((path) => new Geometry(path));
  }

  update() {}

  /**
   * Returns the geometry at the given index.
   */
  geometryAt(index: number) {
    return this.geometries[index];
  }

  /**
   * Returns the path command at the given index.
   */
  at(geometryIndex: number, commandIndex: number) {
    return this.geometryAt(geometryIndex).commandAt(commandIndex);
  }

  // -----------------------------------------------------------------------------------------------
  // Getters
  // -----------------------------------------------------------------------------------------------

  get transformMatrix() {
    return [
      [this.translate.x, this.translate.y, 0],
      [0, 0, this.rotation],
      [0, 0, this.scale],
    ];
  }

  /**
   * Get all path commands from all geometries.
   */
  get geometriesCommands() {
    return this.geometries.map((path) => path.commands);
  }

  get boundingBox() {
    return getGeometryBbox(this.geometriesCommands);
  }
}
