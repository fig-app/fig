<script lang="ts">
    import {getContext, onDestroy} from "svelte";
    import type {VectorContext} from "$lib/types/VectorContext";
    import type {VectorPart} from "$lib/types/VectorPart";
    import {line} from "$lib/primitive/line";
    import type {MLTPathCommand} from "@fig/functions/path/PathCommand";
    import {centerOfSegment, hoverLine} from "@fig/functions/shape/line";
    import {cursorPosition} from "$lib/stores/cursorPosition";
    import {canvasClick} from "$lib/stores/canvasClick";
    import {arc} from "$lib/primitive/arc";
    import {useId} from "@fig/functions/id";
    import {keys} from "$lib/stores/keys";
    import {Timer} from "$lib/stores/canvasTime";
    import {navigation} from "$lib/stores/navigation";

    export let geometryIndex: number;
    export let startIndex: number;
    export let endIndex: number;

    let hovered = false;
    let clicked = false;
    let dragged = false;

    let keyTimer = new Timer(100, "Repeating");

    // Register and unregister part
    let part: VectorPart = {
        id: useId(),
        type: "line",
        draw,
        update,
        selected: false
    };

    let context = getContext<VectorContext>("vector");
    context.register(part);
    onDestroy(() => {
        context.unregister(part);
    })

    // Line commands
    let realStartCommand = context.geometries_commands[geometryIndex][startIndex] as MLTPathCommand;
    let realEndCommand = context.geometries_commands[geometryIndex][endIndex] as MLTPathCommand;
    let virtualStartCommand = {...realStartCommand};
    let virtualEndCommand = {...realEndCommand};

    $: center = centerOfSegment({
        start: virtualStartCommand.endPoint,
        end: virtualEndCommand.endPoint
    });

    // Force update when this variables change (trigger the redraw)
    $: virtualStartCommand || virtualEndCommand || hovered || clicked;

    // Debug

    // Update selected state
    $: if (dragged) {
        context.setDraggedPart(part);

        if (dragged && !part.selected && context.isDragged(part)) {
            part.selected = true;
            context.setSelectedPart(part);
        }
    }

    $: if (!dragged && !canvasClick.pressed) {
        context.setDraggedPart(null, part);
    }

    // Functions
    function draw(ctx: CanvasRenderingContext2D) {
        if (dragged && context.isDragged(part)) {
            drawSelected(ctx);
        } else if (hovered && part.selected) {
            drawHovered(ctx);
        } else if (part.selected) {
            drawSelected(ctx);
        } else if (hovered && context.isDragged(part) === null) {
            if (clicked) {
                drawSelected(ctx);
            } else {
                drawHovered(ctx);
            }
        } else {
            drawDefault(ctx);
        }
    }

    function update() {
        virtualStartCommand.endPoint = navigation.toVirtualPoint(realStartCommand.endPoint);
        virtualEndCommand.endPoint = navigation.toVirtualPoint(realEndCommand.endPoint);

        hovered = hoverLine({
            line: {
                start: virtualStartCommand.endPoint,
                end: virtualEndCommand.endPoint
            }, cursorPosition
        });
        clicked = hovered && canvasClick.single;
        dragged = (dragged && canvasClick.pressed) || (hovered && canvasClick.pressed && !context.isDragged(part));

        center = centerOfSegment({
            start: virtualStartCommand.endPoint,
            end: virtualEndCommand.endPoint
        });

        if (dragged && context.isDragged(part)) {
            let x = cursorPosition.x - canvasClick.clickPoint.x;
            let y = cursorPosition.y - canvasClick.clickPoint.y;
            canvasClick.setClickPoint(cursorPosition.pos)

            realStartCommand.endPoint.x += x;
            realStartCommand.endPoint.y += y;

            realEndCommand.endPoint.x += x;
            realEndCommand.endPoint.y += y;
        }

        if (keyTimer.finished() && part.selected && keys.currentKey) {
            let shiftMultiplier = keys.containKey("Shift") ? 10 : 1;
            let xShift = (keys.isPressed("ArrowLeft") ? -1 : keys.isPressed("ArrowRight") ? 1 : 0) * shiftMultiplier;
            let yShift = (keys.isPressed("ArrowUp") ? -1 : keys.isPressed("ArrowDown") ? 1 : 0) * shiftMultiplier;

            virtualStartCommand.endPoint.x += xShift;
            virtualStartCommand.endPoint.y += yShift;

            virtualEndCommand.endPoint.x += xShift;
            virtualEndCommand.endPoint.y += yShift;
        }
    }

    // Draw functions
    function drawDefault(ctx: CanvasRenderingContext2D) {
        line({
            ctx,
            start: virtualStartCommand.endPoint,
            end: virtualEndCommand.endPoint,
        });
    }

    function drawHovered(ctx: CanvasRenderingContext2D) {
        console.log(virtualStartCommand.endPoint);
        line({
            ctx,
            start: virtualStartCommand.endPoint,
            end: virtualEndCommand.endPoint,
            weight: 2
        });

        // center of line
        arc({
            ctx,
            x: center.x,
            y: center.y,
            colors: {background: "#fff", stroke: "rgb(12, 140, 233)"},
            radius: 4,
            strokeWeight: 1
        });
    }

    function drawSelected(ctx: CanvasRenderingContext2D) {
        line({
            ctx,
            start: virtualStartCommand.endPoint,
            end: virtualEndCommand.endPoint,
            color: "rgb(12, 140, 233)",
            weight: 2
        });
    }
</script>
