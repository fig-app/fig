<script lang="ts">
  import {Button, NumberInput} from "@fig/ui";
  import Canvas from "$lib/canvas/Canvas.svelte"
  import Vector from "$lib/canvas/components/vector/Vector.svelte"
  import {keys} from "$lib/stores";
  import {navigation} from "$lib/canvas/stores/navigation.svelte";
  import {userMode} from "$lib/canvas/stores/userMode.svelte";
  import {Panel, PanelSection} from "$lib/components";
  import * as m from "$lib/paraglide/messages"
  import {Tabs, DropdownMenu} from "@fig/ui/editor";
  import {Input} from "@fig/ui";
  import {ChevronDown} from "lucide-svelte";
  import {ColorPicker} from "$lib/components/color-picker/index.js"
  import {selector} from "$lib/canvas/components/Selector.svelte";
  import {canvasPipeline} from "$lib/canvas/stores/canvasPipeline.svelte";
  import {dev} from "$app/environment";
  import {randomInt} from "@fig/functions/math";
  import {randomColor} from "@fig/functions/color";

  let canvasBackgroundColor = $state("#1E1E1E")
  let leftPanelSize = $state(275);
  let rightPanelSize = $state(275);
  let panelsSize = $derived(leftPanelSize + rightPanelSize);

  // $effect.root(() => {
  //   setTimeout(() => {
  //     console.log("Creating vector")
  //     canvasPipeline.createVector({
  //       strokeGeometry: [{path: "M 100,100 L 200,100 L 640,300 Z"}],
  //     })
  //   }, 1000)
  // })

  function handleKeyDown() {
    if (keys.isPressed('p')) {
      userMode.mode = 'PEN';
    } else if (keys.isPressed('v')) {
      userMode.mode = 'SELECTOR';
    }
  }

  function createRandomRectangle() {
    canvasPipeline.createRectangle({
      x: randomInt(0, window.innerWidth - 400),
      y: randomInt(0, window.innerHeight - 200),
      width: 100,
      height: 100
    }, randomColor())
  }

  $inspect(leftPanelSize, rightPanelSize, panelsSize)
</script>

<svelte:window onkeydown={handleKeyDown}/>

<div class="overflow-hidden w-[100vw] h-[100vh] flex">
  <!-- Panel left -->
  <Panel side="left" minWidth={250} bind:width={leftPanelSize}>
    <p></p>
  </Panel>

  <!-- Canvas -->
  <Canvas backgroundColor={canvasBackgroundColor} width={window.innerWidth - panelsSize}>
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


  <!-- Toolbar -->
  <div
    class="fixed rounded-lg bottom-4 left-1/2 -translate-x-1/2 h-[48px] w-[420px] bg-background"></div>


  <!-- Panel right -->
  <Panel side="right" bind:width={rightPanelSize}>
    <Tabs.Root value="design" class="w-full">
      <div class="p-2 flex items-center justify-between">
        <Tabs.List>
          <Tabs.Trigger value="design">{m.editor_right_panel_design()}</Tabs.Trigger>
          <Tabs.Trigger value="prototype">{m.editor_right_panel_prototype()}</Tabs.Trigger>
        </Tabs.List>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="ghost" size="sm" class="text-xs">
              {navigation.percentScale.toFixed(0)} %
              <ChevronDown class="!size-3"/>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>
              Zoom in
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              Zoom out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <!-- Design -->
      <Tabs.Content value="design" class="divide-y-2 divide-border">
        {#if (!selector.hasSelectedNodes())}
          <PanelSection.Root>
            <PanelSection.Header>
              <PanelSection.Title>Canvas</PanelSection.Title>
            </PanelSection.Header>
            <PanelSection.Content>
              <ColorPicker bind:color={canvasBackgroundColor}/>
            </PanelSection.Content>
          </PanelSection.Root>

          {#if (dev)}
            <PanelSection.Root>
              <PanelSection.Header>
                <PanelSection.Title>Debug</PanelSection.Title>
              </PanelSection.Header>
              <PanelSection.Content>
                <Button variant="secondary" size="sm" onclick={createRandomRectangle}
                        class="w-full">
                  Create random rectangle
                </Button>
              </PanelSection.Content>
            </PanelSection.Root>
          {/if}
        {:else}
          <PanelSection.Root>
            <PanelSection.Header>
              <PanelSection.Title>Position</PanelSection.Title>
            </PanelSection.Header>
            <PanelSection.Content>
              {#if (selector.selectedNode && !selector.hasMultipleSelectedNodes)}
                <div class="flex gap-2">
                  <!-- X position -->
                  <NumberInput inputSize="sm"
                               bind:value={selector.selectedNode.position.x}>
                    {#snippet left()}
                      <span class="text-foreground/60">X</span>
                    {/snippet}
                  </NumberInput>
                  <!-- Y position -->
                  <NumberInput inputSize="sm"
                               bind:value={selector.selectedNode.position.y}>
                    {#snippet left()}
                      <span class="text-foreground/60">Y</span>
                    {/snippet}
                  </NumberInput>
                </div>
              {/if}
            </PanelSection.Content>
          </PanelSection.Root>
        {/if}
      </Tabs.Content>

      <!-- Prototype -->
      <Tabs.Content value="prototype">
      </Tabs.Content>
    </Tabs.Root>
  </Panel>

</div>
