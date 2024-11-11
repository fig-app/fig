<script lang="ts" module>
  import type {Snippet} from "svelte";
  import type {HTMLAttributes} from "svelte/elements";

  export type ColorPickerProps = {
    class: string;
    color?: string;
    opacity?: number;
  }
</script>

<script lang="ts">
  import {Input, InputGroup} from "$lib/components/ui/input/index.js";
  import {NumberInput} from "$lib/components/editor/number-input/index.js";
  import {Percent} from "lucide-svelte";
  import {cn} from "$lib/utils.js";
  import * as Window from "$lib/components/editor/window/index.js";
  import {ColorControls} from "$lib/components/editor/color-picker/index.js";
  import {watch} from "runed";

  let {
    class: className,
    color = "#000000",
    opacity = $bindable(100),
  }: ColorPickerProps = $props();

  let showWindow = $state(true);
  let inputColor = $state('000000');

  watch(() => color, () => {
    inputColor = color.replace('#', '');
  })

  watch(() => inputColor, () => {
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
      <!-- Color preview -->
      {#snippet left()}
        <button class="w-5 h-4 rounded relative overflow-hidden" style:background={color}
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

<Window.Root bind:show={showWindow} minWidth={280}>
  <Window.Header>
    <Window.Title>Color picker</Window.Title>
  </Window.Header>

  <Window.Content>
    <ColorControls bind:color bind:opacity/>
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