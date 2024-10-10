import { Rect } from "$lib/Rect.svelte";
import { EditRect } from "$lib/components/EditRect.svelte";

export class TransformCorners {
  rect: Rect = Rect.new();
  corners: EditRect[] = $state([]);

  constructor(rect: Rect) {
    for (const corner of rect.corners) {
      this.corners.push(new EditRect(corner));
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const corner of this.corners) {
      corner.draw(ctx);
    }
  }

  update() {}
}
