<script lang="ts">
  import {Button, Input} from "$lib";
  import {Hash, Percent, Ruler} from "lucide-svelte";

  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
  }
</script>

<div class="container py-4">
  <Button onclick={toggleTheme}>
    Toggle theme
  </Button>

  <h1 class="text-3xl font-bold text-primary-500 mb-4 mt-8">Temporary
    storybook</h1>
  <p>Storybook is <a
    href="https://github.com/frequency-chain/style-guide/issues/37">not yet
    compatible</a> with Svelte 5.</p>


  <!-- Buttons -->

  <h2 class="text-2xl font-bold text-primary-500 mb-4 mt-6">Buttons</h2>

  <div class="flex flex-col gap-2">

    <div class="flex gap-2">
      <Button size="lg">
        Click me
      </Button>

      <Button size="lg" variant="destructive">
        Click me
      </Button>

      <Button size="lg" variant="outline">
        Click me
      </Button>

      <Button size="lg" variant="secondary">
        Click me
      </Button>

      <Button size="lg" variant="ghost">
        Click me
      </Button>
    </div>

    <div class="flex gap-2">
      <Button>
        Click me
      </Button>

      <Button variant="destructive">
        Click me
      </Button>

      <Button variant="outline">
        Click me
      </Button>

      <Button variant="secondary">
        Click me
      </Button>

      <Button variant="ghost">
        Click me
      </Button>
    </div>

    <div class="flex gap-2">
      <Button size="sm">
        Click me
      </Button>

      <Button size="sm" variant="destructive">
        Click me
      </Button>

      <Button size="sm" variant="outline">
        Click me
      </Button>

      <Button size="sm" variant="secondary">
        Click me
      </Button>

      <Button size="sm" variant="ghost">
        Click me
      </Button>
    </div>

    <div class="flex gap-2">
      <Button disabled>
        Click me
      </Button>

      <Button disabled variant="destructive">
        Click me
      </Button>

      <Button disabled variant="outline">
        Click me
      </Button>

      <Button disabled variant="secondary">
        Click me
      </Button>

      <Button disabled variant="ghost">
        Click me
      </Button>
    </div>
  </div>


  <!-- Inputs -->
  <h2 class="text-2xl font-bold text-primary-500 mb-4 mt-6">Inputs</h2>

  <div class="flex flex-col gap-2">
    <div class="flex gap-2">
      <Input size="lg" placeholder="Large input"/>
      <Input placeholder="Default input"/>
      <Input size="sm" placeholder="Small input"/>
    </div>
    <div class="flex gap-2">
      <Input placeholder="Input">
        {#snippet left()}
          <Ruler/>
        {/snippet}
      </Input>
      <Input placeholder="Input">
        {#snippet right()}
          <Percent/>
        {/snippet}
      </Input>
    </div>
    <div class="flex gap-2">
      <Input size="lg" placeholder="Input">
        {#snippet left()}
          <Hash/>
        {/snippet}
      </Input>
      <Input placeholder="Input">
        {#snippet left()}
          <Hash/>
        {/snippet}
      </Input>
      <Input size="sm" placeholder="Input">
        {#snippet left()}
          <Hash/>
        {/snippet}
      </Input>
    </div>
  </div>
</div>
