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

  export let node: Node;

  let scheduled = false;
  let parts: Set<VectorPart> = new Set();
  let geometries_commands = [];

  let selectedPart: VectorPart | null = null;
  let draggedPart: VectorPart | null = null;

  // Parse all geometries path to an array of PathCommand
  if (node.node.type === "vector") {
    let geometries = node.node.data.strokeGeometry;
    for (const geometry of geometries) {
      geometries_commands.push(parsePathString(normalize(geometry.path)));
    }
  } else {
    console.error(`${node.name} isn't an vector.`);
  }

  // console.log(geometries_commands)
  // $: console.log("Dragged part", draggedPart?.id);

  // Create vector context
  setContext<VectorContext>("vector", {
    register,
    unregister,
    setSelectedPart,
    setDraggedPart,
    isDragged,
    geometries_commands,
  });

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
    if (node.node.type === "vector") {
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
    if (selectedPart) {
      selectedPart.selected = false;
    }
    selectedPart = part;
  }

  function setDraggedPart(part: VectorPart | null, from?: VectorPart) {
    if (!draggedPart && part) {
      draggedPart = part;
    }
    // only the drag part can be reset the draggedPart
    else if (draggedPart && from && draggedPart.id === from.id) {
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

<!-- Draw lines -->
{#each geometries_commands as path_commands, gi}
    {#each path_commands as command, i}
        {#if (command.type === "Z")}
            <VectorLine geometryIndex={gi} startIndex={i - 1} endIndex={0}/>
        {:else if (i < path_commands.length - 1 && (command.type === "M" || command.type === "L"))}
            {#if path_commands[i + 1]?.endPoint}
                <VectorLine geometryIndex={gi} startIndex={i} endIndex={i + 1}/>
            {/if}
        {/if}
    {/each}
{/each}

<!-- Draw points -->
{#each geometries_commands as path_commands, gi}
    {#each path_commands as command, i}
        {#if ((command.type === "M" || command.type === "L"))}
            <VectorPoint geometryIndex={gi} pointIndex={i} isBuilt={true}/>
        {/if}
    {/each}
{/each}