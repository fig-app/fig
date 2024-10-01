<script lang="ts" context="module">
  import Rectangle from "$lib/components/Rectangle.svelte";
  import {Color} from '@fig/types/properties/color/Color';
  import type {Meta} from "@storybook/svelte";

  type FormattedProps = {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  export const meta: Meta<Rectangle & FormattedProps> = {
    title: "Vectors/Rectangle",
    component: Rectangle,
    argTypes: {
      node: {
        control: {
          disable: true
        },
        description: "Rectangle node definition"
      }
    },
    parameters: {
      layout: "fullscreen"
    }
  }
</script>

<script lang="ts">
  import {Story, Template} from "@storybook/addon-svelte-csf";
  import Canvas from "$lib/Canvas.svelte";
</script>

<Template let:args>
    <Canvas fullscreen={true} let:width let:height>
        <Rectangle node={{id: "1234", name: "Rectangle", visible: true, rotation: 0, node: {type: "rectangle", data: {
                    absoluteRenderBounds: {
                        x: args.x,
                        y: args.y,
                        width: args.width,
                        height: args.height,
                    },
                    strokes: [{ color: new Color({ r: 255, g: 255, b: 255, a: 1 }) }],
                    fills: [{ color: new Color({ r: 255, g: 255, b: 255, a: 0.1 }) }],
                    strokeWeight: 1,
                    addidionalData: {
                      cornerSmoothing: 0,
                      rectangleCornerRadii: [0,0,0,0],
                      cornerRadius: 0,
                    },
        }}, ...args.node}}/>
    </Canvas>
</Template>

<Story name="Simple rectangle"
       args={{x: 100, y: 100, width: 100, height: 100}}/>
