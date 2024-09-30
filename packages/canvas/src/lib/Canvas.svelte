<script lang="ts">
    import { afterUpdate, onMount, setContext, tick } from "svelte";
    import type { CanvasContext } from "./types/CanvasContext";
    import type { CanvasNode } from "./types/CanvasNode";
    import { fillRect } from "$lib/primitive/rect";

    // Exports
    export let width = 100;
    export let height = 100;
    export let pipeline: Set<CanvasNode> = new Set();
    export let backgroundColor = "rgba(30, 30, 30, 1)";

    let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D | null;
    let scheduled = false;

    onMount(() => {
        ctx = canvas.getContext("2d");
        draw();
    });

    setContext<CanvasContext>("canvas", {
        register,
        unregister
    });

    // Functions
    function register(node: CanvasNode) {
        onMount(() => {
            pipeline.add(node);
            return () => pipeline.delete(node);
        });

        afterUpdate(async () => {
            if (scheduled) return;

            // await component uptate

            scheduled = true;
            await tick();
            scheduled = false;

            // component is updated
            // so redraw the component
            draw();
        });
    }

    function unregister(node: CanvasNode) {
        pipeline.delete(node);
    }

    function draw() {
        if (ctx) {
            ctx.clearRect(0, 0, width, height);
            fillRect({ctx, x: width / 2, y: height / 2, width, height, color: backgroundColor})

            for (const node of pipeline) {
                node.draw(ctx);
            }
        }
    }
</script>

<canvas bind:this={canvas} {width} {height}>
    <slot></slot>
</canvas>

