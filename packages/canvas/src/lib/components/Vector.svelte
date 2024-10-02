<script lang="ts">
  import type { CanvasNode } from "$lib/types/CanvasNode";
  import type { Node } from "@fig/types/nodes/Node";
  import { getContext, onDestroy, onMount, setContext } from "svelte";
  import type { CanvasContext } from "$lib/types/CanvasContext";
  import type { VectorPart } from "$lib/types/VectorPart";
  import type { VectorContext } from "$lib/types/VectorContext";

  export let node: Node;

  let parts: Set<VectorPart> = new Set();

  // Create vector context
  setContext<VectorContext>("vector", {
    register,
    unregister
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

