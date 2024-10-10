<script>
  import Canvas from "$lib/Canvas.svelte";
  import Vector from "$lib/components/Vector.svelte";
</script>


<Canvas fullscreen={true}>
  <Vector node={{
          id: "vector-id",
          name: "vector-name",
          node: {
            type: "vector",
            data: {
              strokes: [{color: {r: 105, g: 86, b: 214, a: 1}}],
              strokeWeight: 2,
              strokeGeometry: [{path: "M 600,30 L 640,30 L 640,100 L 610,100 Z", windingRule: "", overrideId: 1}, {path: "M 100,100 L 150,100 L 100,200 L 200,100 L 100,300 L 500,300 Z", windingRule: "", overrideId: 1}]
            }
          }
        }}/>

  <Vector node={{
          id: "vector-id",
          name: "vector-name",
          node: {
            type: "vector",
            data: {
              strokes: [{color: {r: 105, g: 86, b: 214, a: 1}}],
              strokeWeight: 2,
              strokeGeometry: [{path: "M 48 0 L59.2257 34.5491 H95.5528 L66.1636 55.9017 L77.3893 90.4509 L48 69.0983L18.6107 90.4509 L29.8364 55.9017 L0.447174 34.5491 H36.7743 L48 0Z", windingRule: "", overrideId: 1}]
            }
          }
        }}/>
</Canvas>

<!--{path: "M 48 0 L59.2257 34.5491 H95.5528 L66.1636 55.9017 L77.3893 90.4509 L48 69.0983L18.6107 90.4509 L29.8364 55.9017 L0.447174 34.5491 H36.7743 L48 0Z", windingRule: "", overrideId: 1}, -->

