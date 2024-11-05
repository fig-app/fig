<script lang="ts">
  import {Meta, Story, Template} from "@storybook/addon-svelte-csf";
  import Button from "$lib/components/ui/button/button.svelte";
</script>

<Meta title="Button" component={Button}/>

<Template let:args>
  <Button {...args}>Hello</Button>
</Template>

<Story name="Default button"/>
