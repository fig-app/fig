<script lang="ts" module>
  import type {WithElementRef} from "bits-ui";
  import type {
    HTMLAnchorAttributes,
    HTMLButtonAttributes
  } from "svelte/elements";
  import {tv, type VariantProps} from "tailwind-variants";

  export const buttonVariants = tv({
    base: "z-0 ring-offset-background ring-offset-0 focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 active:ring-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-2",
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:ring-primary/50",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:ring-destructive/50",
        outline:
          "border-input bg-background hover:bg-input hover:text-accent-foreground border active:ring-secondary/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:ring-secondary/50",
        ghost: "hover:bg-input hover:text-accent-foreground active:ring-secondary/50",
        link: "text-primary underline-offset-4 hover:underline active:ring-secondary/50",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7 rounded-md px-3 active:ring-1 text-sm",
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

  export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
  export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

  export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
    WithElementRef<HTMLAnchorAttributes> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  };
</script>

<script lang="ts">
  import {cn} from "$lib/utils.js";

  let {
    class: className,
    variant = "default",
    size = "default",
    ref = $bindable(null),
    href = undefined,
    type = "button",
    children,
    ...restProps
  }: ButtonProps = $props();
</script>

{#if href}
  <a
    bind:this={ref}
    class={cn(buttonVariants({ variant, size, className }))}
    {href}
    {...restProps}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    bind:this={ref}
    class={cn(buttonVariants({ variant, size, className }))}
    {type}
    {...restProps}
  >
    {@render children?.()}
  </button>
{/if}
