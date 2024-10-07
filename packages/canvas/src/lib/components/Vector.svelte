<script lang="ts">
  import type {CanvasNode} from "$lib/types/CanvasNode";
  import {
    afterUpdate,
    getContext,
    onDestroy,
    onMount,
    setContext,
    tick
  } from "svelte";
  import type {CanvasContext} from "$lib/types/CanvasContext";
  import type {VectorPart} from "$lib/types/VectorPart";
  import type {VectorContext} from "$lib/types/VectorContext";
  import {parsePathString} from "@fig/functions/path/index";
  import VectorLine from "$lib/components/VectorLine.svelte";
  import {normalize} from "@fig/functions/path/normalize";
  import type {Node} from "@fig/types/nodes/Node"
  import VectorPoint from "$lib/components/VectorPoint.svelte";
  import {serializeCommands} from "@fig/functions/path/serialize";
  import {drawPath} from "$lib/primitive/path";
  import {colorToString, getPrimitiveWhite} from "@fig/functions/color";
  import type {PathCommand} from "@fig/functions/path/PathCommand";

  export let node: Node;

  let scheduled = false;
  let parts: Set<VectorPart> = new Set();
  let stroke_paths_syncronization: Path2D[] = [];
  let stroke_geometries_commands: PathCommand[][] = [];

  let selected = false;

  let selectedPart: VectorPart | null = null;
  let draggedPart: VectorPart | null = null;

  let updateTrigger = false;

  // Create vector context
  setContext<VectorContext>("vector", {
    register,
    unregister,
    setSelectedPart,
    setDraggedPart,
    resetDraggedPart,
    isDragged,
    stroke_geometries_commands,
    updateVector: () => {
      updateTrigger = !updateTrigger;
    }
  });

  let vectorContext = getContext<VectorContext>("vector");

  // Parse all geometries path to an array of PathCommand
  if (node.node.type === "vector") {
    let strokeGeometry = node.node.data.strokeGeometry;
    for (const geometry of strokeGeometry) {
      stroke_geometries_commands.push(parsePathString(normalize(geometry.path)))
    }
  } else {
    console.error(`${node.name} isn't an vector.`);
  }

  // Register and unregister vector node
  let canvasNode: CanvasNode = {
    draw,
    update,
    node: node
  };

  let context = getContext<CanvasContext>("canvas");
  context.register(canvasNode);

  onDestroy(() => {
    context.unregister(canvasNode);
  });

  // Functions
  function draw(ctx: CanvasRenderingContext2D) {

    // Update string paths commands of node
    stroke_paths_syncronization = [];
    for (const geometriesCommand of stroke_geometries_commands) {
      let path = new Path2D(serializeCommands(geometriesCommand));
      stroke_paths_syncronization.push(path)
    }

    if (node.node.type === "vector") {
      // draw stylized vector
      for (let path of stroke_paths_syncronization) {
        let strokeColor = colorToString(node.node.data.strokes[0].color);
        let strokeWeight = node.node.data.strokeWeight;
        drawPath({
          ctx,
          path,
          colors: {stroke: strokeColor},
          strokeWeight
        });
      }

      // draw vector skeleton on hover
      for (let path of stroke_paths_syncronization) {
        let strokeColor = colorToString(node.node.data.strokes[0].color);
        drawPath({
          ctx,
          path,
          colors: {stroke: getPrimitiveWhite()}
        });
      }

      // draw all parts
      for (const part of parts) {
        part.draw(ctx);
      }
    } else {
      console.error(`${node.name} isn't a vector.`);
    }
  }

  function update() {
    for (const part of parts) {
      part.update();
    }
  }

  function register(part: VectorPart) {
    onMount(() => {
      parts.add(part);
    });

    afterUpdate(async () => {
      if (scheduled) return;

      scheduled = true;
      await tick();
      scheduled = false;

      context.redraw();
    });
  }

  function unregister(part: VectorPart) {
    parts.delete(part);
  }

  function setSelectedPart(part: VectorPart | null) {
    if (part) {
      part.selected = true;
    }

    if (selectedPart) {
      selectedPart.selected = false;
    }
    selectedPart = part;
  }

  function setDraggedPart(part: VectorPart) {
    if (!draggedPart && part) {
      draggedPart = part;
    }
  }

  function resetDraggedPart(from: VectorPart) {
    // only the drag part can be reset the draggedPart
    if (draggedPart && from && draggedPart.id === from.id) {
      draggedPart = null;
    }
  }

  /**
   * Checks whether the part passed in parameter is the one being dragged
   */
  function isDragged(part: VectorPart) {
    if (draggedPart) {
      return part.id === draggedPart.id;
    } else {
      return null;
    }
  }

</script>

<span></span>

{#key updateTrigger}
  {#each stroke_geometries_commands as path_commands, gi}
    {#each path_commands as command, i}

      <!-- Draw lines -->
      {#if (command.type === "Z")}
        <VectorLine geometryIndex={gi} startIndex={i - 1} endIndex={0}/>
      {:else if (i < path_commands.length - 1 && (command.type === "M" || command.type === "L"))}
        {#if path_commands[i + 1]?.endPoint}
          <VectorLine geometryIndex={gi} startIndex={i} endIndex={i + 1}/>
        {/if}
      {/if}

      <!-- Draw points -->
      {#if ((command.type === "M" || command.type === "L"))}
        <VectorPoint geometryIndex={gi} pointIndex={i}/>
      {/if}
    {/each}
  {/each}
{/key}
