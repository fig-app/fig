<script lang="ts">
  import {getContext, onDestroy} from "svelte";
  import type {VectorContext} from "$lib/types/VectorContext";
  import type {VectorPart} from "$lib/types/VectorPart";
  import {line} from "$lib/primitive/line";
  import type {MLTPathCommand} from "@fig/functions/path/PathCommand";
  import {hoverLine} from "@fig/functions/shape/line";
  import {cursorPosition} from "$lib/stores/cursorPosition";

  export let geometryIndex: number;
  export let startIndex: number;
  export let endIndex: number;

  let hovered = false;
  let part: VectorPart = {type: "line", draw, update, hovered};

  // Register and unregister part
  let context = getContext<VectorContext>("vector");

  context.register(part);

  onDestroy(() => {
    context.unregister(part);
  })

  let startCommand = context.geometries_commands[geometryIndex][startIndex] as MLTPathCommand;
  let endCommand = context.geometries_commands[geometryIndex][endIndex] as MLTPathCommand;

  console.log("Geometry", geometryIndex, "Line", startIndex, "Commands:", startCommand, endCommand)

  $: console.log(geometryIndex, startIndex, hovered);

  // Functions
  function draw(ctx: CanvasRenderingContext2D) {
    if (hovered) {
      line({
        ctx,
        start: startCommand.endPoint,
        end: endCommand.endPoint,
        color: "rgb(12, 140, 233)",
        weight: 2
      });
    } else {
      line({
        ctx,
        start: startCommand.endPoint,
        end: endCommand.endPoint,
      });
    }
  }

  function update() {
    hovered = hoverLine({
      line: {
        start: startCommand.endPoint,
        end: endCommand.endPoint
      }, cursorPosition
    });
  }

</script>


