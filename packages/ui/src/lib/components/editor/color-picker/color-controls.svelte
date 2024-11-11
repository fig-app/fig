<script lang="ts" module>
  import type {Snippet} from "svelte";

  export type ColorControlProps = {
    color: string;
    opacity: number;
  }
</script>

<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {Slider} from "$lib/components/ui/slider/index.js";
  import {
    hexToHsl,
    hueRotationToHex,
    hueRotationToHsl,
    rgbToHex,
    rgbToHsl
  } from "@fig/functions/color";
  import {clamp} from "@fig/functions/math";
  import {watch} from "runed";

  let {
    color = $bindable("#000000"),
    opacity = $bindable(100)
  }: ColorControlProps = $props();

  let canvasSize = $state(200);
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let selector: HTMLDivElement;
  let selectorPosition = $state({x: 0, y: 0});

  let hueRotation = $state([0]);
  let hueInitialised = false;
  let hueColor = $derived(hueRotationToHex(hueRotation[0]));  // convert hue rotation to hex color

  let opacityValue = $state([opacity]);

  onMount(() => {
    ctx = canvas.getContext("2d", {willReadFrequently: true});
    setTimeout(() => {
      draw();

      let hsl = hexToHsl(color);

      console.log("mount color", color);

      if (hsl) {
        hueRotation = [hsl.h];
        hueInitialised = true;

        // Calculate x and y positions based on saturation and lightness
        let x = (hsl.s / 100) * canvasSize - 8;
        let y = (1 - (hsl.l / 100)) * canvasSize - 8;
        selectorPosition = {x, y};
      }
      console.log("mount hsl", hsl, color);

    }, 100)
  })

  onDestroy(() => {
    let hsl = hexToHsl(color);
    console.log("destroy", hsl, color);
  })

  $inspect(selectorPosition)

  // Redraw every change
  $effect(() => draw())

  // Update the color when the hue rotation changes
  watch(() => hueRotation, () => {
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

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // First gradient : transparent to selected color : horizontal
    let gradient = ctx.createLinearGradient(0, 0, canvasSize, 0);
    gradient.addColorStop(0, "#fff");
    gradient.addColorStop(1, hueColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Second : transparent to black : vertical
    let blackGradient = ctx.createLinearGradient(0, 0, 0, canvasSize);
    blackGradient.addColorStop(0, "rgba(0,0,0,0)");
    blackGradient.addColorStop(1, "#000");
    ctx.fillStyle = blackGradient;
    ctx.fillRect(0, 0, canvasSize, canvasSize);
  }

  /**
   * Update the color, based on the pixel clicked on the canvas
   */
  function chooseColor(node: HTMLCanvasElement) {
    let canvasClicked = false;

    node.addEventListener("mousedown", () => {
      canvasClicked = true;
    })

    node.addEventListener("click", updateColor);
    window.addEventListener("mousemove", (e) => {
      if (canvasClicked) {
        updateColor(e);
      }
    });

    window.addEventListener("mouseup", () => {
      canvasClicked = false;
      document.body.style.userSelect = "auto";
    })

    function updateColor(e: MouseEvent) {
      document.body.style.userSelect = "none";

      let x = clamp(e.offsetX, 0, canvasSize) - 8;
      let y = clamp(e.offsetY, 0, canvasSize) - 8;
      selectorPosition = {x, y};

      // Change color
      if (ctx) {
        let rect = canvas.getBoundingClientRect();

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        let imageData = ctx.getImageData(x, y, 1, 1).data;
        color = rgbToHex(imageData[0], imageData[1], imageData[2]);
      }
    }
  }

</script>

<div class="w-full relative" bind:clientWidth={canvasSize}>
  <canvas use:chooseColor bind:this={canvas} width={canvasSize} height={canvasSize}></canvas>
  <div class="absolute size-4 z-40 border-white border-4 rounded-full" bind:this={selector}
       style:background={color} style:top={selectorPosition.y + "px"}
       style:left={selectorPosition.x + "px"}></div>
</div>

<div class="px-8 py-4 flex flex-col gap-5">
  <!-- Color hue -->
  <Slider min={0} max={360} step={1} bind:value={hueRotation}
          style="--thumb-color: {hueColor}; --range-color: transparent; --slider-color: linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)"/>
  <!-- Opacity -->
  <Slider min={0} max={100} step={1} bind:value={opacityValue} style="--thumb-color: rgba(0,0,0,{opacity / 100});--range-color: transparent; --slider-color: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1))"/>
</div>
