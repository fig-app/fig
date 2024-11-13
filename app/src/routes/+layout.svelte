<script lang="ts">
  import {i18n} from "$lib/i18n";
  import {ParaglideJS} from "@inlang/paraglide-sveltekit";
  import {TooltipProvider} from "@fig/ui/c/tooltip/index";
  import '../app.css';

  let {children} = $props();
</script>

<ParaglideJS {i18n}>
  <TooltipProvider>
    {@render children()}
  </TooltipProvider>
</ParaglideJS>
