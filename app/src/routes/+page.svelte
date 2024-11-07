<script>
  // import {Input} from "@fig/ui";
  // import Button from "@fig/ui/components/ui/button/button.svelte";
  import Canvas from "@fig/canvas/Canvas.svelte"
  import Vector from "@fig/canvas/components/Vector.svelte"
  import {keys} from "@fig/canvas/stores/keys.svelte";
  import {userMode} from "@fig/canvas/stores/userMode.svelte";

  function handleKeyDown() {
    if (keys.isPressed('p')) {
      userMode.mode = 'PEN';
    } else if (keys.isPressed('v')) {
      userMode.mode = 'SELECTOR';
    }
  }

</script>

<svelte:window
  onkeydown={(handleKeyDown)}
/>

<div class="overflow-hidden w-[100vw] h-[100vh]">
  <Canvas fullscreen={true}>
    <Vector node={{
              id: "vector-id",
              name: "vector-name",
              node: {
                type: "vector",
                data: {
                  strokes: [{
                    paintType: "Solid",
                    visible: true,
                    opacity: 1,
                    blendMode: "Normal",
                    color: {r: 255, g: 220, b: 64, a: 1},
                  }],
                  strokeWeight: 2,
                  strokeGeometry: [{path: "M 48 0 L59.2257 34.5491 H95.5528 L66.1636 55.9017 L77.3893 90.4509 L48 69.0983L18.6107 90.4509 L29.8364 55.9017 L0.447174 34.5491 H36.7743 Z", windingRule: "", overrideId: 1}]
                }
              }
            }}/>
  </Canvas>

  <div class="fixed rounded-lg bottom-4 left-1/2 -translate-x-1/2 h-[48px] w-[420px] bg-white"></div>

</div>
