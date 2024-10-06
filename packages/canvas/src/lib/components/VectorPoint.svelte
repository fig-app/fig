<script lang="ts">
  import {getContext, onDestroy} from "svelte";
  import type {VectorContext} from "$lib/types/VectorContext";
  import type {VectorPart} from "$lib/types/VectorPart";
  import {cursorPosition} from "$lib/stores/cursorPosition";
  import {isCursorHoveringArc} from "@fig/functions/shape/arc";
  import {canvasClick} from "$lib/stores/canvasClick";
  import {arc} from "$lib/primitive/arc";
  import {useId} from "@fig/functions/id";
  import type {Vector} from "@fig/types/properties/Vector";
  import {getPrimitiveBlue, getPrimitiveWhite} from "@fig/functions/color";

  export let centerPoint: Vector;
  export let isBuilt: boolean;
  // No need for radius variable, because this will be a const
  const RADIUS_DEFAULT: number = 4;
  const RADIUS_SELECTED: number = 5;
  const PRIMITIVE_BLUE: string = getPrimitiveBlue();
  const PRIMITIVE_WHITE: string = getPrimitiveWhite();

  let hovered = false;
  let clicked = false;
  let dragged = false;

  // Register and unregister part
  let part: VectorPart = {
    id: useId(),
    type: "point",
    draw,
    update,
    selected: false
  };

  let context = getContext<VectorContext>("vector");
  context.register(part);
  onDestroy(() => {
    context.unregister(part);
  })

  // Force update when this variables change (trigger the redraw)
  $: hovered || clicked;

  // Debug

  // Update selected state
  $: dragged && (() => {
    context.setDraggedPart(part);

    if (dragged && !part.selected && context.isDragged(part)) {
      part.selected = true;
      context.setSelectedPart(part);
    }
  })();

  $: !dragged && !canvasClick.pressed && (() => {
    context.setDraggedPart(null, part);
  })();

  // Functions
  function draw(ctx: CanvasRenderingContext2D) {
    if (dragged && context.isDragged(part)) {
      drawSelected(ctx);
    } else if (hovered && part.selected) {
      drawHovered(ctx);
    } else if (part.selected) {
      drawSelected(ctx);
    } else if (hovered && context.isDragged(part) === null) {
      if (clicked) {
        drawSelected(ctx);
      } else {
        drawHovered(ctx);
      }
    } else {
      drawDefault(ctx);
    }
  }

  function update() {
    hovered = isCursorHoveringArc({
        cursorPosition,
        arc : {
            centerPosition: centerPoint,
            radius: RADIUS_DEFAULT,
        }
    });

    clicked = hovered && canvasClick.single;
    dragged = dragged && canvasClick.pressed || hovered && canvasClick.pressed && !context.isDragged(part);
  }

  // Draw functions
  function drawDefault(ctx: CanvasRenderingContext2D) {
    arc({
      ctx,
      x: centerPoint.x,
      y: centerPoint.y,
      radius: RADIUS_DEFAULT,
    });
  }

  function drawHovered(ctx: CanvasRenderingContext2D) {
    arc({
        ctx,
        x: centerPoint.x,
        y: centerPoint.y,
        radius: RADIUS_DEFAULT,
        colors: {
            background: PRIMITIVE_WHITE,
            stroke: PRIMITIVE_WHITE,
        }
    });
  }

  function drawSelected(ctx: CanvasRenderingContext2D) {
    arc({
        ctx,
        x: centerPoint.x,
        y: centerPoint.y,
        radius: RADIUS_SELECTED,
        colors: {
            background: PRIMITIVE_BLUE,
            stroke: PRIMITIVE_WHITE,
        },
    });
  }

</script>


