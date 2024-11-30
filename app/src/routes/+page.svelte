<script lang="ts">
  import {Button, Input, NumberInput} from "@fig/ui";
  import Canvas from "$lib/canvas/Canvas.svelte"
  import Vector from "$lib/canvas/components/vector/Vector.svelte"
  import {keys} from "$lib/stores";
  import {navigation} from "$lib/canvas/stores/navigation.svelte";
  import {Panel, PanelSection} from "$lib/components";
  import * as m from "$lib/paraglide/messages"
  import {DropdownMenu, Tabs} from "@fig/ui/editor";
  import {ChevronDown} from "lucide-svelte";
  import {ColorPicker} from "$lib/components/color-picker/index.js"
  import {selector} from "$lib/canvas/components/Selector.svelte";
  import {
    canvasPipeline,
    DEFAULT_PAINT,
    DEFAULT_VECTOR_DATA
  } from "$lib/canvas/stores/canvasPipeline.svelte";
  import {dev} from "$app/environment";
  import {randomInt} from "@fig/functions/math";
  import {randomColor} from "@fig/functions/color";
  import {canvasSettings} from "$lib/canvas/stores/canvasSettings.svelte";
  import PanelRight from "$lib/panels/panel-right.svelte"

  // Util line to remove 'unused import' effect
  [Tabs, DropdownMenu, Input, PanelSection];

  let canvasBackgroundColor = $state("#1E1E1E")
  let leftPanelSize = $state(275);
  let rightPanelSize = $state(275);
  let panelsSize = $derived(leftPanelSize + rightPanelSize);

  function handleKeyDown() {
    if (keys.isPressed('p')) {
      canvasSettings.mode = 'PEN';
    } else if (keys.isPressed('v')) {
      canvasSettings.mode = 'SELECTOR';
    }
  }

  function handleResize() {
    leftPanelSize = 275;
    rightPanelSize = 275;
  }
</script>

<svelte:window onkeydown={handleKeyDown} onresize={handleResize}/>

<div class="overflow-hidden w-[100vw] h-[100vh] flex">
  <!-- Panel left -->
  <Panel side="left" minWidth={250} bind:width={leftPanelSize}>
    <p></p>
  </Panel>

  <!-- Canvas -->
  <Canvas width={window.innerWidth - panelsSize}>
    <Vector node={{
              id: "vector-1",
              name: "etoile-1",
              node: {
                type: "vector",
                data: {
                  strokes: [{
                    paintType: "Solid",
                    visible: true,
                    opacity: 1,
                    blendMode: "Normal",
                    color: {r: 255, g: 0, b: 0, a: 1},
                  }],
                  strokeWeight: 2,
                  strokeGeometry: [{path: "M 148 100 L159.2257 134.5491 H195.5528 L166.1636 155.9017 L177.3893 190.4509 L148 169.0983 L118.6107 190.4509 L129.8364 155.9017 L100.447174 134.5491 H136.7743 Z", windingRule: "", overrideId: 1}]
                }
              }
            }}/>

    <Vector node={{
              id: "vector-2",
              name: "etoile-2",
              node: {
                type: "vector",
                data: {
                  ...DEFAULT_VECTOR_DATA,
                  strokes: [{
                    ...DEFAULT_PAINT,
                    color: {r: 255, g: 220, b: 64, a: 1},
                  }],
                  strokeWeight: 2,
                  strokeGeometry: [{path: "M 48 0 L59.2257 34.5491 H95.5528 L66.1636 55.9017 L77.3893 90.4509 L48 69.0983L18.6107 90.4509 L29.8364 55.9017 L0.447174 34.5491 H36.7743 Z", windingRule: "", overrideId: 1}]
                }
              }
            }}/>
  </Canvas>

  <!-- Toolbar -->
  <div
    class="fixed rounded-lg bottom-4 left-1/2 -translate-x-1/2 h-[48px] w-[420px] bg-background"></div>

  <!-- Panel right -->
  <PanelRight bind:panelSize={rightPanelSize}/>

</div>
