<script lang="ts">
  import {getContext, onDestroy} from "svelte";
  import type {VectorContext} from "$lib/types/VectorContext";
  import type {VectorPart} from "$lib/types/VectorPart";
  import {line} from "$lib/primitive/line";
  import type {MLTPathCommand} from "@fig/functions/dist/src/path/PathCommand";

  export let geometryIndex: number;
  export let startIndex: number;
  export let endIndex: number;

  let part: VectorPart = {type: "line", draw};

  // Register and unregister part
  let context = getContext<VectorContext>("vector");

  context.register(part);

  onDestroy(() => {
    context.unregister(part);
  })

  let startCommand = context.geometries_commands[geometryIndex][startIndex] as MLTPathCommand;
  let endCommand = context.geometries_commands[geometryIndex][endIndex] as MLTPathCommand;

  console.log("Geometry", geometryIndex, "Line", startIndex, "Commands:", startCommand, endCommand)

  // Functions
  function draw(ctx: CanvasRenderingContext2D) {
    line({ctx, start: startCommand.endPoint, end: endCommand.endPoint})
  }

</script>


