<script lang="ts">
  import type {Separator as SeparatorPrimitive} from "bits-ui";
  import {Separator} from "$lib/components/ui/separator";
  import {cn} from "$lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: SeparatorPrimitive.RootProps = $props();
</script>

<Separator bind:ref class={cn("bg-border -mx-1 my-2 h-px", className)}
           {...restProps}/>
