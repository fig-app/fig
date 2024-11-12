<script lang="ts" module>
  export type ColorPickerProps = {
    class?: string;
    color?: string;
    opacity?: number;
  }
</script>

<script lang="ts">
  import {Percent} from "lucide-svelte";
  import {watch} from "runed";
  import {cn} from "@fig/ui/utils";
  import {Input, InputGroup} from "@fig/ui";
  import {NumberInput, Window} from "@fig/ui/editor";
  import type {Vector} from "@fig/types/properties/Vector";
  import {ColorControls} from "$lib/components/color-picker/index";

  let {
    class: className,
    color = $bindable("#000000"),
    opacity = $bindable(100),
  }: ColorPickerProps = $props();

  let showWindow = $state(false);
  let windowPosition: Vector = $state({x: 0, y: 0});
  let inputColor = $state('000000');

  watch(() => color, () => {
    inputColor = color.replace('#', '');
  })

  watch(() => inputColor, () => {
    console.log('inputColor', inputColor);
    color = '#' + inputColor;
  })

  function toggleWindow() {
    showWindow = !showWindow;
  }

  function autoCompleteColor() {
    if (inputColor.at(0)?.toLowerCase() === 'f' && inputColor.length === 1) {
      inputColor = 'FFFFFF';
    }
    if (inputColor.at(0)?.toLowerCase() === '0' && inputColor.length === 1) {
      inputColor = '000000';
    }
    if (inputColor.length === 3) {
      inputColor = inputColor.split('').map((c) => c + c).join('');
    }
    if (inputColor.length === 2) {
      inputColor = inputColor + inputColor + inputColor;
    }
    if (inputColor.length < 6) {
      inputColor = inputColor.padEnd(6, '0');
    }
    inputColor = inputColor.toUpperCase();
  }

  function blurOnEnter(e: KeyboardEvent & { currentTarget: (EventTarget & HTMLInputElement) }) {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  }
</script>

<div class={cn(className)}>
  <InputGroup>
    <Input bind:value={inputColor} class="pl-1 py-1" inputSize="sm" selectOnFocus
           onblur={autoCompleteColor} onkeydown={blurOnEnter}>
      {#snippet left()}
        <!-- Color preview -->
        <button class="w-5 h-4 rounded relative overflow-hidden"
                style:background={color}
                onclick={toggleWindow}>
          <!-- Opacity -->
          <span class="opacity" style:opacity={(100 - opacity) / 100}></span>
        </button>
      {/snippet}
    </Input>

    <NumberInput min="0" max="100" bind:value={opacity} class="w-[100px]" inputSize="sm">
      {#snippet right()}
        <Percent/>
      {/snippet}
    </NumberInput>
  </InputGroup>
</div>

<Window.Root bind:show={showWindow} minWidth={260} class="max-w-[260px]">
  <Window.Header>
    <Window.Title>Color picker</Window.Title>
  </Window.Header>

  <Window.Content>
    <ColorControls bind:color bind:inputColor bind:opacity/>
  </Window.Content>
</Window.Root>

<style>
  .opacity {
    width: 50%;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    background: url(data:image/svg+xml;utf8,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200H3V3H0V0Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M3%200H6V3H3V0Z%22%20fill%3D%22white%22/%3E%3Cpath%20d%3D%22M3%203H6V6H3V3Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M0%203H3V6H0V3Z%22%20fill%3D%22white%22/%3E%3C/svg%3E%0A);
  }
</style>