<script lang="ts">
    import type { CanvasNode } from "$lib/types/CanvasNode";
    import type { Node } from "@fig/types/Node";
    import type { VectorNode } from "@fig/types/VectorNode";
    import type { RectangleNode } from "@fig/types/RectangleNode";
    import { getContext } from "svelte";
    import type { NodeType } from "@fig/types/NodeType";
    import { rect } from "$lib/primitive/rect";
    import { colorToString } from "$lib/utils/color";
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
        if ("Rectangle" in node.nodeType) {
            console.log("coucou");
            
            let data = node.nodeType.Rectangle;
            if (data.absoluteRenderBounds) {
                console.log("coucouaze");
                
                let x = data.absoluteRenderBounds.x;
                let y = data.absoluteRenderBounds.y;
                let width = data.absoluteRenderBounds.width;
                let height = data.absoluteRenderBounds.height;
                let background = colorToString(data.fills[0].color);
                let stroke = colorToString(data.strokes[0].color);
                let radius = data.addidionalData.cornerRadius;
                let strokeWidth = data.strokeWeight;
                console.log(x, y, width, height, background, stroke);

                rect({ctx, x, y, colors: {background, stroke}, height, width, radius, strokeWidth});
            }
        } else {
            console.error(`${node.name} isn't a rectangle.`);
        }
    }

</script>