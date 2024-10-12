import type {Vector} from "@fig/types/properties/Vector";
import {PathCommand} from "./PathCommand";

type ArcDefinition = {
  radii: Vector;
  rotation: number;
  large: boolean;
  clockwise: boolean;
  endPoint: Vector;
};

/**
 * Parse path commands string
 *
 * Made with help of [d-path-parser](https://github.com/MaxArt2501/d-path-parser/blob/master/parser.js) function.
 *
 * More information about path commands : [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#lineto_path_commands).
 *
 * @param d svg path commands
 *
 * @return PathCommand[]
 */
export function parsePathString(d: string): PathCommand[] {
  if (!d || d.length == 0) return [];

  let regex = {
    command: /\s*([achlmqstvz])/gi,
    number: /\s*([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/gi,
    comma: /\s*(?:(,)|\s)/g,
    flag: /\s*([01])/g,
  };
  let matchers = {
    number: (must: boolean): number | null => {
      let x = get("number", must);
      if (x === null) return null;
      return +x;
    },
    coordinate_pair: (must: boolean): Vector | null => {
      let x = get("number", must);
      if (x === null && !must) return null;
      get("comma");
      let y = get("number", true);
      return {x: parseFloat(x as string), y: parseFloat(y as string)};
    },
    arc_definition: (must: boolean) => {
      let radii = matchers["coordinate_pair"](must);
      if (!radii && !must) return null;
      get("comma");
      let rotation = parseFloat(get("number", true) as string);
      get("comma", true);
      let large = !!parseInt(get("flag", true) as string);
      get("comma");
      let sweep = !!parseInt(get("flag", true) as string);
      get("comma");
      let end = matchers["coordinate_pair"](true);
      return {
        radii: radii,
        rotation: rotation,
        large: large,
        clockwise: sweep,
        endPoint: end,
      };
    },
  };

  type RegexKeys = keyof typeof regex;
  type MatcherKeys = keyof typeof matchers;

  let commands: PathCommand[] = [];
  let index = 0;

  while (index < d.length) {
    let command = get("command");
    let upCommand = command?.toUpperCase();
    let relative = command !== upCommand;
    let sequence: PathCommand[] = [];
    let coords: Vector[];

    if (!command) return [];

    switch (command) {
      // Move commands
      case "m":
      case "M":
      // Line commands
      case "l":
      case "L":
      // Quadratic bézier curve
      case "t":
      case "T":
        sequence.push({
          type: command,
          relative,
          endPoint: getSequence<Vector>("coordinate_pair")[0],
        });
        break;

      // Cubic bézier curve
      case "c":
      case "C":
        coords = getSequence<Vector>("coordinate_pair");

        sequence.push({
          type: command,
          relative,
          endPoint: coords[2],
          controlPoints: {
            start: coords[0],
            end: coords[1],
          },
        });
        break;

      // Quadratic bézier curve
      case "q":
      case "Q":
      // Cubic bézier curve
      case "s":
      case "S":
        coords = getSequence<Vector>("coordinate_pair");

        sequence.push({
          type: command,
          relative,
          endPoint: coords[0],
          controlPoint: coords[1],
        });
        break;

      // Horizontal line
      case "h":
      case "H":
      // Vertical line
      case "v":
      case "V":
        let value = getSequence<number>("number")[0];

        sequence.push({
          type: command,
          relative,
          value,
        });
        break;

      // Elliptical arc curve
      case "a":
      case "A":
        let data = getSequence<ArcDefinition>("arc_definition")[0];

        sequence.push({
          type: command,
          relative,
          radii: data.radii,
          rotation: data.rotation,
          large: data.large,
          clockwise: data.clockwise,
          endPoint: data.endPoint,
        });
        break;

      // Close path
      case "z":
      case "Z":
        sequence = [{type: "Z", relative}];
        break;
    }

    commands.push.apply(commands, sequence);
  }

  return commands;

  // Functions
  function get(key: RegexKeys, must?: boolean) {
    regex[key].lastIndex = index;
    let result = regex[key].exec(d);

    // If no result
    if (!result || result.index !== index) {
      if (!must) return null;
      throw new Error(
        "Expected " +
        must +
        " at position " +
        index +
        " " +
        d.charAt(index - 1) +
        d.charAt(index) +
        d.charAt(index + 1),
      );
    }

    index = regex[key].lastIndex;
    return result[1];
  }

  function getSequence<T>(key: MatcherKeys): T[] {
    let sequence = [];
    let matched;
    let must = true;

    while ((matched = matchers[key](must)) !== null) {
      sequence.push(matched);
      must = !!get("comma");
    }

    return sequence as T[];
  }
}
