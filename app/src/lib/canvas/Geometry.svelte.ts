import type { PathCommand } from "@fig/functions/path/PathCommand";
import { navigation } from "$lib/canvas/stores/navigation.svelte";
import { serializeCommands } from "@fig/functions/path/serialize";
import { parsePathString } from "@fig/functions/path/index";
import { normalize } from "@fig/functions/path/normalize";

export class Geometry {
  commands: PathCommand[] = $state([]);

  constructor(path: string) {
    this.commands = parsePathString(normalize(path));
  }

  commandAt(index: number) {
    return this.commands[index];
  }

  /**
   * Converts all commands coordinates to virtual coordinates.
   */
  toVirtualCommands() {
    let commands: PathCommand[] = [];
    for (let command of this.commands) {
      commands.push(navigation.toVirtualCommand(command));
    }
    return commands;
  }

  /**
   * Converts all commands coordinates to virtual coordinates and returns a new geometry.
   */
  toVirtual() {
    let geometry = new Geometry("");
    geometry.commands = this.toVirtualCommands();
    return geometry;
  }

  /**
   * Serializes all commands to a string.
   */
  serialize() {
    return serializeCommands(this.commands);
  }
}
