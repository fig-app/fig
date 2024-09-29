<script>
    import Canvas from "$lib/Canvas.svelte";
    import Rectangle from "$lib/components/Rectangle.svelte";

    let innerWidth = 0;
    let innerHeight = 0;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<Canvas width={innerWidth} height={innerHeight}>
    <Rectangle  node={{id: "aze", name: "aze", rotation: 0, nodeType: {
        Rectangle: {
            absoluteRenderBounds: {
                x: 200,
                y: 200,
                width: 100,
                height: 100,
            },
            strokes: [{color: {r: 255, g: 10, b: 20, a: 1}}],
            fills: [{color: {r: 50, g: 10, b: 20, a: 1}}],
            strokeWeight: 10,
            addidionalData: {
                cornerRadius: 0,
            },
        }
    }, visible: true}} />
</Canvas>
