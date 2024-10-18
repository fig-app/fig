import { describe, expect, it } from "vitest";
import { parsePathString } from "../src/path";
import { serializeCommands } from "../src/path/serialize";

describe("Test parsePathString function", () => {
  it("With empty path", () => {
    let path = "";
    expect(parsePathString(path)).toStrictEqual([]);
  });

  it("With simple path", () => {
    let path = "M 15.2 40 v 5.30 M 10,5.4 Z";
    expect(parsePathString(path)).toStrictEqual([
      {
        type: "M",
        relative: false,
        endPoint: { x: 15.2, y: 40 },
      },
      {
        type: "v",
        relative: true,
        value: 5.3,
      },
      {
        type: "M",
        relative: false,
        endPoint: { x: 10, y: 5.4 },
      },
      {
        type: "Z",
        relative: false,
      },
    ]);
  });

  it("With cubic bezier curve", () => {
    let path = "C 20 20 40 40 50.40 30";
    expect(parsePathString(path)).toStrictEqual([
      {
        type: "C",
        relative: false,
        controlPoints: {
          start: { x: 20, y: 20 },
          end: { x: 40, y: 40 },
        },
        endPoint: { x: 50.4, y: 30 },
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

describe("Test serializeCommands", () => {
  it("With simple commands", () => {
    expect(
      serializeCommands([
        {
          type: "M",
          relative: false,
          endPoint: { x: 15.2, y: 40 },
        },
        {
          type: "v",
          relative: true,
          value: 5.3,
        },
        {
          type: "M",
          relative: false,
          endPoint: { x: 10, y: 5.4 },
        },
        {
          type: "Z",
          relative: false,
        },
      ]),
    ).toStrictEqual("M 15.2 40 v 5.3 M 10 5.4 Z");
  });
});
