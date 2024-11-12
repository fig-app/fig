<script lang="ts" module>
  import type {Snippet} from "svelte";

  export type ColorControlProps = {
    color: string;
    inputColor: string;
    opacity: number;
  }
</script>

<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {
    hexToHsl, hslToHsv,
    hueRotationToHex,
    hueRotationToHsl,
    rgbToHex,
    rgbToHsl
  } from "@fig/functions/color";
  import {clamp} from "@fig/functions/math";
  import {watch} from "runed";
  import {Percent} from "lucide-svelte";
  import {Input, InputGroup, Slider} from "@fig/ui";
  import {NumberInput} from "@fig/ui/editor";

  let {
    color = $bindable("#000000"),
    inputColor = $bindable("000000"),
    opacity = $bindable(100)
  }: ColorControlProps = $props();

  let canvasSize = $state(200);
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;

  let selectorPosition = $state({x: 0, y: 0});
  let canvasClicked = $state(false);

  let hueRotation = $state([0]);
  let hueInitialised = false;
  let hueColor = $derived(hueRotationToHex(hueRotation[0]));  // convert hue rotation to hex color

  let opacityValue = $state([opacity]);

  onMount(() => {
    ctx = canvas.getContext("2d", {willReadFrequently: true});
    setTimeout(() => {
      draw();

      let hsl = hexToHsl(color);

      // console.log("mount hsl", hsl, color);

      if (hsl) {
        hueRotation = [hsl.h];
        hueInitialised = true;

        // Update the selector position
        let {h, s, v} = hslToHsv(hsl.h, hsl.s, hsl.l);
        let x = Math.floor((s / 100) * canvasSize) - 1;
        let y = Math.floor((1 - (v / 100)) * canvasSize) - 1;
        selectorPosition = {x, y};
      }
    }, 100)
  })

  // onDestroy(() => {
  //   console.log(selectorPosition);
  //   console.log("                   color", color, hexToHsl(color));
  // })

  // $inspect(selectorPosition).with(((s, v) => console.log("selector position", v)));
  // $inspect(color).with(((s, v) => console.log("color", hexToHsl(v))));

  // Update the color when the hue rotation changes
  watch(() => hueRotation, () => {
    draw();

    if (ctx && hueInitialised) {
      let x = selectorPosition.x;
      let y = selectorPosition.y;

      if (x >= 0 && y >= 0 && x <= canvasSize && y <= canvasSize) {
        let imageData = ctx.getImageData(x, y, 1, 1).data;
        color = rgbToHex(imageData[0], imageData[1], imageData[2]);
      }
    }
  })

  // Update the opacity
  $effect(() => {
    opacity = opacityValue[0];
  })

  $effect(() => {
    opacityValue[0] = opacity;
  })

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // First gradient : transparent to selected color : horizontal
    let gradient = ctx.createLinearGradient(0, 0, canvasSize, 0);
    gradient.addColorStop(0, "#fff");
    gradient.addColorStop(0.002, "#fff");
    gradient.addColorStop(0.999, hueColor);
    gradient.addColorStop(1, hueColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Second : transparent to black : vertical
    let blackGradient = ctx.createLinearGradient(0, 0, 0, canvasSize);
    blackGradient.addColorStop(0, "rgba(0,0,0,0)");
    blackGradient.addColorStop(0.001, "rgba(0,0,0,0)");
    blackGradient.addColorStop(0.999, "#000");
    blackGradient.addColorStop(1, "#000");
    ctx.fillStyle = blackGradient;
    ctx.fillRect(0, 0, canvasSize, canvasSize);
  }

  function updateColor(e: MouseEvent) {
    document.body.style.userSelect = "none";

    // Update the color, based on the pixel clicked on the canvas
    if (ctx) {
      let rect = canvas.getBoundingClientRect();
      let x = Math.floor(clamp(e.clientX - rect.left, 0, rect.width - 1));
      let y = Math.floor(clamp(e.clientY - rect.top, 0, rect.height - 1));

      selectorPosition = {x, y};

      let imageData = ctx.getImageData(x, y, 1, 1).data;
      color = rgbToHex(imageData[0], imageData[1], imageData[2]);
    }
  }

  function mouseMove(e: MouseEvent) {
    e.preventDefault();
    if (canvasClicked) {
      updateColor(e);
    }
  }

  function mouseDown(e: MouseEvent) {
    if (e.button === 0) {
      canvasClicked = true;
      updateColor(e)
    }
  }

  function mouseUp() {
    canvasClicked = false;
    document.body.style.userSelect = "auto";
  }

</script>

<svelte:window onmouseup={mouseUp} onmousemove={mouseMove}/>

<div class="w-full relative" bind:clientWidth={canvasSize}>
  <canvas bind:this={canvas} width={canvasSize} height={canvasSize}
          onmousedown={mouseDown}></canvas>
  <div class="absolute size-4 z-40 border-white border-4 rounded-full pointer-events-none ring-1 ring-border"
       style:background={color} style:top={selectorPosition.y - 8 + "px"}
       style:left={selectorPosition.x - 8 + "px"}></div>
</div>

<div class="px-6 py-4 flex flex-col gap-5">
  <!-- Color hue -->
  <Slider min={0} max={360} step={1} bind:value={hueRotation}
          style="--thumb-color: {hueColor}; --range-color: transparent; --slider-color: linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)"/>
  <!-- Opacity -->
  <Slider min={0} max={100} step={1} bind:value={opacityValue}
          style="--thumb-color: rgba(0,0,0,{opacity / 100});--range-color: transparent; --slider-color: linear-gradient(to right, rgba(255,255,255,1), rgba(0,0,0,1))"/>

  <!-- Inputs -->
  <InputGroup>
    <Input bind:value={inputColor} inputSize="sm" selectOnFocus />
    <NumberInput min="0" max="100" bind:value={opacity} class="w-[100px]" inputSize="sm">
      {#snippet right()}
        <Percent/>
      {/snippet}
    </NumberInput>
  </InputGroup>
</div>
