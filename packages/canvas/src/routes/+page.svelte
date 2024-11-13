<script>
  import Canvas from "$lib/Canvas.svelte";
  import Vector from "$lib/components/vector/Vector.svelte";
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
              strokeGeometry: [{path: "M 100,100 L 200,100 L 640,300 Z", windingRule: "", overrideId: 1}]
            }
          }
        }}/>

  <!--  <Vector node={{-->
  <!--          id: "vector-id",-->
  <!--          name: "vector-name",-->
  <!--          node: {-->
  <!--            type: "vector",-->
  <!--            data: {-->
  <!--              strokes: [{color: {r: 105, g: 86, b: 214, a: 1}}],-->
  <!--              strokeWeight: 2,-->
  <!--              strokeGeometry: [{path: "M 100,100 L 640,30 L 640,100 L 610,100 Z", windingRule: "", overrideId: 1}, {path: "M 100,100 L 150,100 L 100,200 L 200,100 L 100,300 L 500,300 Z", windingRule: "", overrideId: 1}]-->
  <!--            }-->
  <!--          }-->
  <!--        }}/>-->

  <Vector node={{
            id: "vector-id",
            name: "vector-name",
            node: {
              type: "vector",
              data: {
                strokes: [{color: {r: 255, g: 220, b: 64, a: 1}}],
                strokeWeight: 2,
                strokeGeometry: [{path: "M20 20 M 48 0 L59.2257 34.5491 H95.5528 L66.1636 55.9017 L77.3893 90.4509 L48 69.0983L18.6107 90.4509 L29.8364 55.9017 L0.447174 34.5491 H36.7743 Z", windingRule: "", overrideId: 1}]
              }
            }
          }}/>

  <Vector node={{
            id: "vector-id",
            name: "cruves",
            node: {
              type: "vector",
              data: {
                strokes: [{color: {r: 255, g: 255, b: 255, a: 1}}],
                strokeWeight: 1,
                strokeGeometry: [{path: "M1277.5 343.5H901.5V192C901.5 192 890.066 60.71 947 51.5C1007.863 41.6545 1019 192 1019 192C1019 192 1047.427 115.9219 1086 119C1122.055 121.8771 1143 192 1143 192C1143 192 1204.5 74.5 1277.5 192C1321.744 231.28 1277.5 343.5 1277.5 343.5Z", windingRule: "", overrideId: 1}]
              }
            }
          }}/>

</Canvas>


