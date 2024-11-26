import type {Vector} from "@fig/types/properties/Vector";

type CanvasClickStates = {
  single: boolean;
  double: boolean;
  pressed: boolean;
  clickPoint: Vector | null;
};

class CanvasClickSvelte {
  private states: CanvasClickStates = $state({
    single: false,
    double: false,
    pressed: false,
    clickPoint: null,
  });

  constructor() {
  }

  get single() {
    return this.states.single;
  }

  get double() {
    return this.states.double;
  }

  get pressed() {
    return this.states.pressed;
  }

  get clickPoint() {
    let point = this.states.clickPoint;
    return point ? point : {x: 0, y: 0};
  }

  public setClickPoint(point: Vector) {
    this.states.clickPoint = point;
  }

  public setSingleClick(click: boolean, point: Vector) {
    this.states.single = click;
    console.log("1");
    this.states.clickPoint = point;
  }

  public setDoubleClick(click: boolean, point: Vector) {
    this.states.double = click;
    console.log("2");
    this.states.clickPoint = point;
  }

  public setPress(click: boolean, point: Vector) {
    console.log("3");
    this.states.pressed = click;
    this.states.clickPoint = point;
  }

  public resetClick() {
    this.states.single = false;
    this.states.double = false;
    this.states.pressed = false;
    this.states.clickPoint = null;
  }
}

export const canvasClick = new CanvasClickSvelte();
