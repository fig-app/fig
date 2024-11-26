import type {CanvasNode} from "$lib/canvas/types/CanvasNode";
import type {VectorNode} from "@fig/types/nodes/vector/VectorNode";
import type {EmptyData} from "@fig/types/nodes/vector/EmptyData";
import type {Node} from "@fig/types/nodes/Node";
import {useLongId} from "@fig/functions/id";
import type {Paint} from "@fig/types/properties/paint/Paint";
import type {Rectangle} from "@fig/types/properties/Rectangle";
import type {Color} from "@fig/types/properties/color/Color";

class CanvasPipeline {
  pipeline = $state(new Set<CanvasNode>());
  creationPipeline = $state(new Array<Node>());

  addNode(node: CanvasNode) {
    this.pipeline.add(node);
  }

  createVector(vectorData: Partial<VectorNode<EmptyData>>) {
    let allVectorData: VectorNode<EmptyData> = {...DEFAULT_VECTOR_DATA, ...vectorData};
    let node: Node = {
      id: useLongId(),
      name: "Vector",
      visible: true,
      node: {
        type: "vector",
        data: allVectorData,
      },
      rotation: 0,
    };

    this.creationPipeline.push(node);
  }

  createRectangle(size: Rectangle, strokeColor: Color = {r: 0, g: 0, b: 0, a: 1}) {
    this.createVector({
      strokeGeometry: [
        {
          path: `
            M${size.x},${size.y}
            L${size.x + size.width},${size.y}
            L${size.x + size.width},${size.y + size.height}
            L${size.x},${size.y + size.height}
            Z`,
        },
      ],
      strokes: [
        {
          ...DEFAULT_PAINT,
          color: strokeColor,
        },
      ],
    });
  }

  clearCreationPipeline() {
    this.creationPipeline = [];
  }
}

export const canvasPipeline = new CanvasPipeline();

export const DEFAULT_PAINT: Paint = {
  paintType: "Solid",
  visible: true,
  blendMode: "Color",
  opacity: 100,
  color: {
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  },
  gradientHandlePositions: [],
  gradientStops: [],
  scaleMode: "Fill",
  rotation: 0,
  imageRef: "",
  gifRef: "",
  filters: {
    contrast: 0,
    saturation: 0,
    exposure: 0,
    highlights: 0,
    shadows: 0,
    tint: 0,
    temperature: 0,
  },
};

export const DEFAULT_FILL_PAINT: Paint = {
  ...DEFAULT_PAINT,
  color: {
    r: 217,
    g: 217,
    b: 217,
    a: 1,
  },
};

export const DEFAULT_STROKE_PAINT: Paint = {
  ...DEFAULT_PAINT,
  color: {
    r: 0,
    g: 0,
    b: 0,
    a: 1,
  },
};

export const DEFAULT_VECTOR_DATA: VectorNode<EmptyData> = {
  locked: false,
  blendMode: "Color",
  opacity: 100,
  preserveRatio: false,
  layoutAlign: "Inherit",
  layoutGrow: 0,
  constraint: {
    vertical: "Top",
    horizontal: "Left",
  },
  size: {width: 0, height: 0},
  absoluteBoundingBox: {x: 0, y: 0, width: 0, height: 0},
  relativeTransform: {
    matrix: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 1],
    ],
  },
  exportSettings: [],
  effects: [],
  isMask: false,
  fills: [],
  fillGeometry: [],
  strokes: [DEFAULT_STROKE_PAINT],
  strokeGeometry: [],
  strokeWeight: 1,
  individualStrokeWeights: {
    top: 1,
    left: 1,
    bottom: 1,
    right: 1,
  },
  strokeCap: "None",
  strokeJoin: "Mitter",
  strokeDashes: [],
  strokeMiterAngle: 28,
  strokeAlign: "Inside",
  styles: {
    Fill: "",
    Grid: "",
    Text: "",
    Effect: "",
  },
  transitionEasing: "Linear",
  annotations: [],
  additionalData: {},
};
