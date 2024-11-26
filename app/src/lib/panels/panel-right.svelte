<script lang="ts" module>
  export type PanelRightProps = {
    panelSize: number
  }
</script>

<script lang="ts">
  import * as m from "$lib/paraglide/messages.js";
  import {navigation} from "$lib/canvas/stores/navigation.svelte.js";
  import {selector} from "$lib/canvas/components/Selector.svelte.js";
  import {dev} from "$app/environment";
  import {ColorPicker} from "$lib/components/color-picker/index.js";
  import {Panel} from "$lib/components/index.js";
  import {ChevronDown} from "lucide-svelte";
  import {Tabs, DropdownMenu, Button, NumberInput} from "@fig/ui"
  import {PanelSection} from "$lib/components";
  import {canvasPipeline} from "$lib/canvas/stores/canvasPipeline.svelte";
  import {randomInt} from "@fig/functions/math";
  import {colorToString, randomColor} from "@fig/functions/color";
  import {canvasSettings} from "$lib/canvas/stores/canvasSettings.svelte";

  let {panelSize = $bindable(275)}: PanelRightProps = $props();
  let multipleNodesSelected = $derived(selector.hasMultipleSelectedNodes);

  function createRandomRectangle() {
    canvasPipeline.createRectangle({
      x: randomInt(0, window.innerWidth - 400),
      y: randomInt(0, window.innerHeight - 200),
      width: 100,
      height: 100
    }, randomColor())
  }

</script>

<Panel side="right" bind:width={panelSize}>
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
            <ColorPicker bind:color={canvasSettings.backgroundColor}/>
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
      {:else if (selector.selectedNode)}

        <!-- Position -->
        <PanelSection.Root>
          <PanelSection.Header>
            <PanelSection.Title>Position</PanelSection.Title>
          </PanelSection.Header>
          <PanelSection.Content>
            {#if (!multipleNodesSelected)}
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

        <!-- Layout -->
        <PanelSection.Root>
          <PanelSection.Header>
            <PanelSection.Title>Layout</PanelSection.Title>
          </PanelSection.Header>
          <PanelSection.Content>
            <div class="flex gap-2">

            </div>
          </PanelSection.Content>
        </PanelSection.Root>

        <!-- Stroke -->
        <PanelSection.Root>
          <PanelSection.Header>
            <PanelSection.Title>Stroke</PanelSection.Title>
          </PanelSection.Header>
          <PanelSection.Content>
            <!--            <ColorPicker bind:color={strokeColor}/>-->
          </PanelSection.Content>
        </PanelSection.Root>
      {/if}
    </Tabs.Content>

    <!-- Prototype -->
    <Tabs.Content value="prototype">
    </Tabs.Content>
  </Tabs.Root>
</Panel>