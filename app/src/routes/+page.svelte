<script lang="ts">
    import { Button, Switch, Label } from "@fig/ui";
    import type {Node} from "@fig/types/Node"
</script>

<Button>Coucou</Button>

<div class="flex items-center space-x-2 mt-2">
    <Switch id="switch" />
    <Label for="switch">Switch</Label>
</div>