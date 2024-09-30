<script lang="ts">
    import type { CanvasNode } from "$lib/types/CanvasNode";
    import type { Node } from "@fig/types/nodes/Node";
    import { getContext } from "svelte";
    import { rect } from "$lib/primitive/rect";
    import type { CanvasContext } from "$lib/types/CanvasContext";

    export let node: Node;
    // VectorNode<RectangleNode>

    let _node: CanvasNode = {
        draw,
        node: node
    }

    let context = getContext<CanvasContext>("canvas");

    context.register(_node);

    function draw(ctx: CanvasRenderingContext2D) {
        if (node.node.type === "rectangle") {
            let data = node.node.data;

            if (data.absoluteRenderBounds) {
                let x = data.absoluteRenderBounds.x;
                let y = data.absoluteRenderBounds.y;
                let width = data.absoluteRenderBounds.width;
                let height = data.absoluteRenderBounds.height;
                let background = data.fills.length > 0 ? data.fills[0].color.toString() : null;
                let stroke = data.strokes.length > 0 ? data.strokes[0].color.toString() : null;
                let radius = data.addidionalData.cornerRadius;
                let strokeWidth = data.strokeWeight;

                rect({ctx, x, y, colors: {background, stroke}, height, width, radius, strokeWidth});
            }
        } else {
            console.error(`${node.name} isn't a rectangle.`);
        }
    }

</script>