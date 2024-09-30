<script lang="ts" context="module">
    import {Button, buttonVariants} from "$lib/button/index";
    import type { Meta } from '@storybook/svelte'

    export const meta: Meta<Button> = {
        title: "Button",
        component: Button,
        argTypes: {
            variant: {
                control: "select",
                options: Object.keys(buttonVariants['variants']['variant'])
            },
            size: {
                control: "select",
                options: Object.keys(buttonVariants['variants']['size'])
            }
        }
    }
</script>

<script lang="ts">
    import {Story, Template} from "@storybook/addon-svelte-csf";
</script>

<Template let:args>
    <Button {...args}>Button</Button>
</Template>

<Story name="Primary Button" />
