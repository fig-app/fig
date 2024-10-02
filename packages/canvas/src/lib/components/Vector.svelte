<script lang="ts">
  import type {CanvasNode} from "$lib/types/CanvasNode";
  import type {Node} from "@fig/types/nodes/Node";
  import {getContext, onDestroy, onMount, setContext} from "svelte";
  import type {CanvasContext} from "$lib/types/CanvasContext";
  import type {VectorPart} from "$lib/types/VectorPart";
  import type {VectorContext} from "$lib/types/VectorContext";
  import {parsePathString} from "@fig/functions/path/index";
  import VectorLine from "$lib/components/VectorLine.svelte";
  import {normalize} from "@fig/functions/path/normalize";

  export let node: Node;

  let parts: Set<VectorPart> = new Set();
  let geometries_commands = [];

  if (node.node.type === "vector") {
    let geometries = node.node.data.strokeGeometry;
    for (const geometry of geometries) {
      geometries_commands.push(parsePathString(normalize(geometry.path)));
    }
  }

  // Create vector context
  setContext<VectorContext>("vector", {
    register,
    unregister,
    geometries_commands,
  });

  // Register and unregister vector node
  let canvasNode: CanvasNode = {
    draw,
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

  function register(part: VectorPart) {
    onMount(() => {
      parts.add(part);
    });
  }

  function unregister(part: VectorPart) {
    parts.delete(part);
  }

</script>

{#each geometries_commands as path_commands, gi}
    {#each path_commands as command, i}

        {#if (i < path_commands.length - 1 && (command.type === "M" || command.type === "L"))}
            <VectorLine geometryIndex={gi} startIndex={i} endIndex={i + 1}/>
        {/if}

    {/each}
{/each}