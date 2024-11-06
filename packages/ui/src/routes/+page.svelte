<script lang="ts">
  import {Button, Input} from "$lib/index.js";
  import * as Select from "$lib/components/editor/select/index.js";
  import * as Tabs from "$lib/components/editor/tabs/index.js";

  import {
    Component,
    Crop,
    Hash,
    Percent,
    Ruler, Search,
    Square,
    VenetianMask
  } from "lucide-svelte";
  import {
    Option,
    OptionContainer,
    OptionSeparator
  } from "$lib/components/editor/options/index.js";

  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
  }

  // For select
  const fruits = [
    {value: "apple", label: "Apple"},
    {value: "banana", label: "Banana"},
    {value: "blueberry", label: "Blueberry"},
    {value: "grapes", label: "Grapes"},
    {value: "pineapple", label: "Pineapple"}
  ];

  let value = $state("");

  const triggerContent = $derived(
    fruits.find((f) => f.value === value)?.label ?? "Select a fruit"
  );
</script>

<div class="container py-10">
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

      <Button size="lg" variant="secondary">
        Click me
      </Button>

      <Button size="lg" variant="outline">
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

      <Button variant="secondary">
        Click me
      </Button>

      <Button variant="outline">
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

      <Button size="sm" variant="secondary">
        Click me
      </Button>

      <Button size="sm" variant="outline">
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

      <Button disabled variant="secondary">
        Click me
      </Button>

      <Button disabled variant="outline">
        Click me
      </Button>

      <Button disabled variant="ghost">
        Click me
      </Button>
    </div>
    <div class="flex gap-2">
      <Button size="icon">
        <Ruler/>
      </Button>
      <Button size="icon-sm">
        <Ruler/>
      </Button>
    </div>

    <div class="flex gap-2">
      <Button size="icon-sm">
        <Ruler/>
      </Button>
      <Button size="icon-sm" variant="destructive">
        <Ruler/>
      </Button>
      <Button size="icon-sm" variant="secondary">
        <Ruler/>
      </Button>
      <Button size="icon-sm" variant="outline">
        <Ruler/>
      </Button>
      <Button size="icon-sm" variant="ghost">
        <Ruler/>
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

  <h2 class="text-2xl font-bold text-primary-500 mb-4 mt-6">Options</h2>

  <OptionContainer class="w-[180px]">
    <Option>
      <Crop/>
      Crop image
    </Option>
    <OptionSeparator/>
    <Option>
      <Component/>
      Create component
    </Option>
    <OptionSeparator/>
    <Option>
      <Square/>
      Edit object
    </Option>
    <Option>
      <VenetianMask/>
      Use as mask
    </Option>
  </OptionContainer>

  <!-- Select -->

  <h2 class="text-2xl font-bold text-primary-500 mb-4 mt-6">Select</h2>

  <div class="flex flex-col gap-2">
    <Select.Root type="single" name="favoriteFruit" bind:value>
      <Select.Trigger class="w-[180px]">
        {triggerContent}
      </Select.Trigger>
      <Select.Content>
        {#each fruits as fruit}
          <Select.Item value={fruit.value} label={fruit.label}/>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>


  <!-- Tabs -->

  <h2 class="text-2xl font-bold text-primary-500 mb-4 mt-6">Tabs</h2>

  <div class="flex flex-col gap-6">

    <Tabs.Root value="tab-1" class="w-[200px]">
      <Tabs.List class="grid w-full grid-cols-2">
        <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab-2">Tab 2</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab-1">
        <p>Tab 1 content</p>
      </Tabs.Content>
      <Tabs.Content value="tab-2">
        <p>Tab 2 content</p>
      </Tabs.Content>
    </Tabs.Root>

    <Tabs.Root value="tab-1" class="w-[200px]">
      <div class="flex items-center justify-between">
        <Tabs.List class="grid w-full grid-cols-2">
          <Tabs.Trigger value="tab-1">File</Tabs.Trigger>
          <Tabs.Trigger value="tab-2">Assets</Tabs.Trigger>
        </Tabs.List>
        <Button size="icon-sm" variant="ghost">
          <Search/>
        </Button>
      </div>
      <Tabs.Content value="tab-1">
        <p>File</p>
      </Tabs.Content>
      <Tabs.Content value="tab-2">
        <p>Assets</p>
      </Tabs.Content>
    </Tabs.Root>
  </div>
</div>
