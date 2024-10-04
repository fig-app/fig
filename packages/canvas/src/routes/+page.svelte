<script>
  import Canvas from "$lib/Canvas.svelte";
  import Vector from "$lib/components/Vector.svelte";
  import Keys from "$lib/components/Keys.svelte";
</script>

<Keys/>

<Canvas fullscreen={true}>
    <Vector node={{
          id: "vector-id",
          name: "vector-name",
          node: {
            type: "vector",
            data: {
              strokeGeometry: [{path: "M 10,30 L 40,30 L 40,100 L 10,100 L 10,30"}, {path: "M 100,100 L 150,100 L 100,200 L 200,100 L 100,300 L 500,300"}]
            }
          }
        }}/>
</Canvas>
