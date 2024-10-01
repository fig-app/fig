<script lang="ts" context="module">
  import type {Meta} from '@storybook/svelte'
  import Canvas from "$lib/Canvas.svelte";

  export const meta: Meta<Canvas> = {
    title: "Canvas",
    component: Canvas,
    argTypes: {
      backgroundColor: {
        control: {
          type: "color",
        }
      },
      pipeline: {
        table: {
          disable: true
        },
        control: {
          disable: true
        }
      }
    },
    parameters: {
      layout: "fullscreen"
    }
  }
</script>

<script lang="ts">
  import {Story, Template} from "@storybook/addon-svelte-csf";
  import CenterDecorator from "./CenterDecorator.svelte";
</script>

<Template let:args>
    <CenterDecorator>
        <Canvas {...args}></Canvas>
    </CenterDecorator>
</Template>

<Story name="Simple canvas"
       args={{width: 400, height: 400, fullscreen: false}}/>

<Story name="Fullscreen canvas" args={{fullscreen: true}}/>
