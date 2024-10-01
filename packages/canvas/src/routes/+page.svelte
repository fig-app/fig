<script>
    import Canvas from "$lib/Canvas.svelte";

    let innerWidth = 0;
  let innerHeight = 0;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<Canvas width={innerWidth} height={innerHeight}>

</Canvas>
