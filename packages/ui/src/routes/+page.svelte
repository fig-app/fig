<script lang="ts">
  import {Button, Input} from "$lib";
  import * as Select from "$lib/components/editor/select";
  import * as Tabs from "$lib/components/editor/tabs";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import * as Window from "$lib/components/editor/window";
  import * as DropdownMenu from "$lib/components/editor/dropdown-menu";

  import {
    Banana,
    Component,
    Crop,
    Hash, Link2,
    Percent,
    Ruler, Search,
    Square, Unlink2,
    VenetianMask
  } from "lucide-svelte";
  import {
    Option,
    OptionContainer,
    OptionSeparator
  } from "$lib/components/editor/options";
  import {Toggle} from "$lib/components/ui/toggle";
  import {InputGroup} from "$lib/components/ui/input";
  import {NumberInput} from "$lib/components/editor/number-input";

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

  // For window
  let showWindow = $state(false);
  let windowTop = $state(60);
  let windowLeft = $state(60);

  // For dropdown with checkbox
  let options = $state({
    pixelGrid: true,
    snap: true,
    layoutGrid: false,
    rulers: false
  })

  // and for radio
  let radioValue = $state("all")

  // For toggle
  let linked = $state(false);

  // For number input
  let numberInputValue = $state(50);
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

  <!-- Color picker -->

  <h2 class="text-2xl font-bold text-primary-500 mb-4 mt-6">Color picker</h2>

  <!--  <ColorPicker class="w-[200px]"/>-->

  <!-- Number input -->

  <h2 class="text-2xl font-bold text-primary-500 mb-4 mt-6">Number input</h2>

  <div class="flex flex-col gap-2">
    <div class="flex gap-5 items-center">
      <NumberInput class="w-[100px]" min="0" max="100" bind:value={numberInputValue}>
        {#snippet right()}
          <Percent/>
        {/snippet}
      </NumberInput>
      {numberInputValue}
    </div>
    <NumberInput class="w-[100px]">
      {#snippet left()}
        <Banana/>
      {/snippet}
    </NumberInput>
  </div>


  <!-- Window -->

  <h2 class="text-2xl font-bold text-primary-500 mb-4 mt-6">Window</h2>

  <div class="flex gap-4">
    <Button onclick={() => showWindow = true} variant="secondary">
      Open window
    </Button>

    <div class="w-[200px] flex gap-2">
      <NumberInput bind:value={windowTop} min="0">
        {#snippet left()}
          <p>X</p>
        {/snippet}
      </NumberInput>
      <NumberInput bind:value={windowLeft} min="0">
        {#snippet left()}Y{/snippet}
      </NumberInput>
    </div>
  </div>

  <Window.Root class="w-[400px]" bind:show={showWindow} top={windowTop}
               left={windowLeft} minHeight={100}>
    <Window.Header>
      <Window.Title>Window title</Window.Title>
    </Window.Header>

    <Window.Content class="px-4 py-2">
      <p>Window content</p>
    </Window.Content>
  </Window.Root>


  <!-- Dropdown Menu -->

  <h2 class="text-2xl font-bold text-primary-500 mb-4 mt-6">Dropdown Menu</h2>

  <div class="flex gap-4">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="secondary">
          Open menu
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>
          Back to files
        </DropdownMenu.Item>
        <OptionSeparator/>
        <DropdownMenu.Item>
          <Search/>
          Actions...
          <DropdownMenu.Shortcut>
            Ctrl+K
          </DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <OptionSeparator/>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            File
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item>
              New design file
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              New FigJam file
            </DropdownMenu.Item>
            <OptionSeparator/>
            <DropdownMenu.Item>
              Export...
              <DropdownMenu.Shortcut>
                Ctrl+Shift+E
              </DropdownMenu.Shortcut>
            </DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            Edit
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item>
              Undo
              <DropdownMenu.Shortcut>
                Ctrl+Z
              </DropdownMenu.Shortcut>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              Redo
              <DropdownMenu.Shortcut>
                Ctrl+Y
              </DropdownMenu.Shortcut>
            </DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            View
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.CheckboxItem bind:checked={options.pixelGrid}>
              Pixel grid
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem bind:checked={options.snap}>
              Snap to pixel grid
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem bind:checked={options.layoutGrid}>
              Layout grids
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem bind:checked={options.rulers}>
              Rulers
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      </DropdownMenu.Content>
    </DropdownMenu.Root>

    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="secondary">
          Options
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.CheckboxItem bind:checked={options.pixelGrid}>
          Pixel grid
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.CheckboxItem bind:checked={options.snap}>
          Snap to pixel grid
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.CheckboxItem bind:checked={options.layoutGrid}>
          Layout grids
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.CheckboxItem bind:checked={options.rulers}>
          Rulers
        </DropdownMenu.CheckboxItem>
      </DropdownMenu.Content>
    </DropdownMenu.Root>

    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="secondary">
          Filter by
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.RadioGroup bind:value={radioValue}>
          <DropdownMenu.RadioItem value="all">
            All
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="images">
            Images
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="videos">
            Videos
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="audio">
            Audio
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>


  <!-- Toggle -->

  <h2 class="text-2xl font-bold text-primary-500 mb-4 mt-6">Toggle</h2>

  <div class="flex gap-2">

    <Toggle>
      Toggle
    </Toggle>

    <Toggle bind:pressed={linked} size="icon">
      {#if (linked)}
        <Link2/>
      {:else}
        <Unlink2/>
      {/if}
    </Toggle>

    <Toggle bind:pressed={linked} size="icon-sm">
      {#if (linked)}
        <Link2/>
      {:else}
        <Unlink2/>
      {/if}
    </Toggle>

  </div>

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
      <Input inputSize="lg" placeholder="Large input"/>
      <Input placeholder="Default input"/>
      <Input inputSize="sm" placeholder="Small input"/>
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
      <Input inputSize="lg" placeholder="Input">
        {#snippet left()}
          <Hash/>
        {/snippet}
      </Input>
      <Input placeholder="Input">
        {#snippet left()}
          <Hash/>
        {/snippet}
      </Input>
      <Input inputSize="sm" placeholder="Input">
        {#snippet left()}
          <Hash/>
        {/snippet}
      </Input>
    </div>
  </div>


  <!-- Input group -->

  <h2 class="text-2xl font-bold text-primary-500 mb-4 mt-6">Input group</h2>

  <div class="flex flex-col gap-2">
    <div class="grid grid-cols-3 gap-2">
      <InputGroup>
        <Input inputSize="lg" placeholder="Number"/>
        <Input inputSize="lg" placeholder="Number"/>
      </InputGroup>
      <InputGroup>
        <Input placeholder="Number"/>
        <Input placeholder="Number"/>
      </InputGroup>
      <InputGroup>
        <Input inputSize="sm" placeholder="Number"/>
        <Input inputSize="sm" placeholder="Number"/>
      </InputGroup>
    </div>

    <div class="flex gap-2">
      <InputGroup>
        <Input class="w-[150px]" value="#FFFFFF"/>
        <Input class="w-[100px]" value="100">
          {#snippet right()}
            <Percent/>
          {/snippet}
        </Input>
      </InputGroup>
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


  <!-- Tooltip -->
  <h2 class="text-2xl font-bold text-primary-500 mb-4 mt-6">Tooltip</h2>

  <div class="flex flex-col gap-2 items-start">
    <Tooltip.Root>
      <Tooltip.Trigger>Hover to show a tooltip</Tooltip.Trigger>
      <Tooltip.Content>
        <p>Hi I'm a tooltip</p>
      </Tooltip.Content>
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger>Hover to show a long tooltip</Tooltip.Trigger>
      <Tooltip.Content>
        <p class="w-[300px]">Lorem ipsum dolor sit amet, consectetur adipiscing
          elit, sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua.</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </div>

</div>
