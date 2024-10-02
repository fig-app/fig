import { describe, expect, it } from "vitest";
import { parsePathString } from "../src/path";

describe("Test parsePathString function", () => {
  it("With empty path", () => {
    let path = "";
    expect(parsePathString(path)).toStrictEqual([]);
  });

  it("With simple path", () => {
    let path = "M 15.2 40 v 5.30 M 10,5.4";
    expect(parsePathString(path)).toStrictEqual([
      {
        type: "M",
        relative: false,
        end_point: { x: 15.2, y: 40 },
      },
      {
        type: "v",
        relative: true,
        value: 5.3,
      },
      {
        type: "M",
        relative: false,
        end_point: { x: 10, y: 5.4 },
      },
    ]);
  });

  it("With incorrect path command", () => {
    let path = "E 20,30";
    expect(parsePathString(path)).toStrictEqual([]);
  });

  it("With incorrect command parameters", () => {
    let path = "M 20";
    expect(() => parsePathString(path)).toThrowError(/Expected true/);
  });
});
