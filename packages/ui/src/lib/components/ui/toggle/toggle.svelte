<script lang="ts" module>
  import {type VariantProps, tv} from "tailwind-variants";

  export const toggleVariants = tv({
    base: "hover:bg-secondary focus-visible:ring-ring data-[state=on]:bg-primary/20 data-[state=on]:dark:bg-primary/20 data-[state=on]:text-primary/80 data-[state=on]:dark:text-[#7cc4f8] inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-2",
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border-input hover:bg-accent hover:text-accent-foreground border bg-transparent",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7 rounded-md px-3 active:ring-1",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  });

  export type ToggleVariant = VariantProps<typeof toggleVariants>["variant"];
  export type ToggleSize = VariantProps<typeof toggleVariants>["size"];
  export type ToggleVariants = VariantProps<typeof toggleVariants>;
</script>

<script lang="ts">
  import {Toggle as TogglePrimitive} from "bits-ui";
  import {cn} from "$lib/utils.js";

  let {
    ref = $bindable(null),
    pressed = $bindable(false),
    class: className,
    size = "default",
    variant = "default",
    ...restProps
  }: TogglePrimitive.RootProps & {
    variant?: ToggleVariant;
    size?: ToggleSize;
  } = $props();
</script>

<TogglePrimitive.Root
  bind:ref
  bind:pressed
  class={cn(toggleVariants({ variant, size, className }))}
  {...restProps}
/>
