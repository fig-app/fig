<script>
  import Canvas from "$lib/Canvas.svelte";
  import Vector from "$lib/components/Vector.svelte";

  let innerWidth = 0;
  let innerHeight = 0;
</script>

<svelte:window bind:innerWidth bind:innerHeight/>

<Canvas width={innerWidth} height={innerHeight}>
    <Vector node={{
          id: "vector-id",
          name: "vector-name",
          node: {
            type: "vector",
            data: {
              strokeGeometry: [{path: "M 10,30 L 40,30 L 40,100 L 10,100 L 10,30"}, {path: "M 100,100 L 150,100 L 100,200 L 200,100 L 100,300 l 500,300"}]
            }
          }
        }}/>
</Canvas>
