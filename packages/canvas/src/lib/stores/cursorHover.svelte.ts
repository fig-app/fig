import type {VectorPart} from "$lib/types/VectorPart";

type cursorStatusState = {
  hoveredPart: VectorPart | null,
}

class cursorHoverSvelte {
  private state: cursorStatusState = $state({
    hoveredPart: null,
  });

  constructor() {
  }

  get hoveredPart() {
    return this.state.hoveredPart;
  }

  set hoveredPart(hoveredPart: VectorPart | null) {
    this.state.hoveredPart = hoveredPart;
  }

  removeHoveredPart() {
    this.state.hoveredPart = null;
  }

}

export let cursorHover = new cursorHoverSvelte();
