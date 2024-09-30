<script>
    import Canvas from "$lib/Canvas.svelte";
    import Rectangle from "$lib/components/Rectangle.svelte";
    import { Color } from "@fig/types/properties/color/Color";

    let innerWidth = 0;
    let innerHeight = 0;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<Canvas width={innerWidth} height={innerHeight}>
    <Rectangle
        node={{
            id: "aze",
            name: "aze",
            rotation: 0,
            node: {
                type: "rectangle",
                data: {
                    absoluteRenderBounds: {
                        x: 200,
                        y: 200,
                        width: 100,
                        height: 100,
                    },
                    strokes: [{ color: new Color({ r: 255, g: 10, b: 20, a: 1 }) }],
                    fills: [{ color: new Color({ r: 255, g: 255, b: 255, a: 0.1 }) }],
                    strokeWeight: 10,
                    addidionalData: {
                        cornerRadius: 10,
                    },
                },
            },
            visible: true,
        }}
    />
</Canvas>
