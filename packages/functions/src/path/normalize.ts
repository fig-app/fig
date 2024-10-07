import {
  absolutize,
  normalize as normalizeSegment,
  parsePath,
  serialize,
} from "path-data-parser";

export function normalize(string: string) {
  let segments = parsePath(string);
  let absolute = absolutize(segments);
  let normalize = normalizeSegment(absolute);
  return serialize(normalize);
}
