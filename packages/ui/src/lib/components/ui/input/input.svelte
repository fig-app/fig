<script lang="ts" module>
  import {tv, type VariantProps} from "tailwind-variants";
  import type {HTMLInputAttributes} from "svelte/elements";
  import type {WithElementRef} from "bits-ui";
  import type {Snippet} from "svelte";

  export const inputVariants = tv({
    base: "flex items-center gap-2 border-input bg-input ring-offset-0 placeholder:text-muted-foreground has-[:focus]:ring-primary flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium has-[:focus]:outline-none has-[:focus]:ring-1 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-1",
    variants: {
      size: {
        default: "h-10 w-full",
        sm: "px-2 py-1 h-fit [&_svg]:size-3",
        lg: "h-12"
      },
    },
    defaultVariants: {
      size: "default",
    },
  });

  export type InputSize = VariantProps<typeof inputVariants>["size"];

  export type InputProps = WithElementRef<HTMLInputAttributes> & {
    inputSize?: InputSize,
    selectOnFocus?: boolean,
    left?: Snippet,
    right?: Snippet
  };
</script>

<script lang="ts">
  import {cn} from "$lib/utils.js";
  import {useId} from "@fig/functions/id";

  let {
    ref = $bindable(null),
    id = null,
    value = $bindable(),
    class: className,
    selectOnFocus: _selectOnFocus = false,
    inputSize,
    left,
    right,
    ...restProps
  }: InputProps = $props();

  if (!id) {
    id = useId();
  }

  function selectOnFocus(node: HTMLInputElement) {
    if (_selectOnFocus) {
      node.addEventListener("focus", () => {
        node.select();
      });
    }
  }
</script>

<label for={id} class={cn(inputVariants({size: inputSize, className}))}>
  {#if (left)}
    {@render left()}
  {/if}

  <input
    id={id}
    bind:this={ref}
    bind:value
    use:selectOnFocus
    {...restProps}
  />

  {#if (right)}
    {@render right()}
  {/if}
</label>

<style>
  /* Reset input */
  input {
    bottom: 0;
    background: transparent;
    outline: none;
    width: 100%;
  }
</style>