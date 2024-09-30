<script lang="ts">
    import type { CanvasNode } from "$lib/types/CanvasNode";
    import type { Node } from "@fig/types/nodes/Node";
    import { getContext } from "svelte";
    import { rect } from "$lib/primitive/rect";
    import type { CanvasContext } from "$lib/types/CanvasContext";

    export let node: Node;

    let canvasNode: CanvasNode = {
        draw,
        node: node
    }

    let context = getContext<CanvasContext>("canvas");

    context.register(canvasNode);

    function draw(ctx: CanvasRenderingContext2D) {
        if (node.node.type === "vector") {
            let data = node.node.data;

            if (data.absoluteRenderBounds) {
                
            }
        } else {
            console.error(`${node.name} isn't a vector.`);
        }
    }

</script>