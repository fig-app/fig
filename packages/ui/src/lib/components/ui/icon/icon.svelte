<script lang="ts" module>
  import * as icons from "lucide-svelte";
  import type {WithElementRef} from "bits-ui";
  import type {HTMLAttributes} from "svelte/elements";

  export type IconName = keyof typeof icons;

  type IconProps = WithElementRef<HTMLAttributes<HTMLOrSVGElement>> & {
    name: keyof typeof icons;
    size: number;
    color: string;
    strokeWidth: number;
    absoluteStrokeWidth: boolean;
  };
</script>

<script lang="ts">
  import * as _icons from "lucide-svelte";

  let {
    ref = $bindable(undefined),
    name,
    size = 24,
    color = "currentColor",
    strokeWidth = 1,
    absoluteStrokeWidth = false,
    ...restProps
  }: IconProps = $props();
</script>

{#if name in _icons}
  <svelte:component bind:this={ref} this={_icons[name]} {size} {color} {strokeWidth}
                    {absoluteStrokeWidth}
                    {...restProps}/>
{:else}
  <span>Icon not found: {name}</span>
{/if}