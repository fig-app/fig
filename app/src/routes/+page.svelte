<script lang="ts">
  import {Button} from "@fig/ui";
  import Canvas from "@fig/canvas/Canvas.svelte"
  import Vector from "@fig/canvas/components/Vector.svelte"
  import {keys} from "@fig/canvas/stores/keys.svelte";
  import {navigation} from "@fig/canvas/stores/navigation.svelte";
  import {userMode} from "@fig/canvas/stores/userMode.svelte";
  import {Panel, PanelSection} from "$lib/components";
  import * as m from "$lib/paraglide/messages"
  import {Tabs, DropdownMenu} from "@fig/ui/editor";
  import {Input} from "@fig/ui";
  import {ChevronDown} from "lucide-svelte";
  import {ColorPicker} from "$lib/components/color-picker/index.js"

  let canvasBackgroundColor = $state("#1E1E1E")

  function handleKeyDown(e: KeyboardEvent) {
    if (keys.isPressed('p')) {
      userMode.mode = 'PEN';
    } else if (keys.isPressed('v')) {
      userMode.mode = 'SELECTOR';
    }
  }

</script>

<svelte:window onkeydown={handleKeyDown}/>


<div class="overflow-hidden w-[100vw] h-[100vh]">
  <!-- Panel right -->
  <Panel side="right">
    <Tabs.Root value="design" class="w-[275px]">
      <div class="p-2 flex items-center justify-between">
        <Tabs.List>
          <Tabs.Trigger value="design">Design</Tabs.Trigger>
          <Tabs.Trigger value="prototype">Prototype</Tabs.Trigger>
        </Tabs.List>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="ghost" size="sm" class="text-xs">
              {navigation.percentScale.toFixed(0)} %
              <ChevronDown/>
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
      <Tabs.Content value="design" class="divide-y divide-border">
        <PanelSection.Root>
          <PanelSection.Header>
            <PanelSection.Title>Canvas</PanelSection.Title>
          </PanelSection.Header>
          <PanelSection.Content>
            <ColorPicker bind:color={canvasBackgroundColor}/>
          </PanelSection.Content>
        </PanelSection.Root>
      </Tabs.Content>

      <!-- Prototype -->
      <Tabs.Content value="prototype">
      </Tabs.Content>
    </Tabs.Root>
  </Panel>

  <!-- Canvas -->
  <Canvas fullscreen={true} backgroundColor={canvasBackgroundColor}>
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

  <div
    class="fixed rounded-lg bottom-4 left-1/2 -translate-x-1/2 h-[48px] w-[420px] bg-background"></div>
</div>
