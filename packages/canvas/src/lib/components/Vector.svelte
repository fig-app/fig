<script lang="ts">
  import type {CanvasNode} from "$lib/types/CanvasNode";
  import {getContext, onDestroy, onMount, setContext} from "svelte";
  import type {CanvasContext} from "$lib/types/CanvasContext";
  import type {VectorPart} from "$lib/types/VectorPart";
  import type {VectorContext} from "$lib/types/VectorContext";
  import {parsePathString} from "@fig/functions/path/index";
  import VectorLine from "$lib/components/VectorLine.svelte";
  import {normalize} from "@fig/functions/path/normalize";
  import VectorPoint from "$lib/components/VectorPoint.svelte";
  import {serializeCommands} from "@fig/functions/path/serialize";
  import {drawPath} from "$lib/primitive/path";
  import {
    colorToString,
    getPrimitiveBlue,
    getPrimitiveWhite
  } from "@fig/functions/color";
  import type {PathCommand} from "@fig/functions/path/PathCommand";
  import {navigation} from "$lib/stores/navigation";
  import {getGeometryBbox} from "@fig/functions/path/bBox";
  import {Rect} from "$lib/Rect.svelte";
  import {strokeRect} from "$lib/primitive/rect";
  import {canvasClick} from "$lib/stores/canvasClick.svelte";
  import type {Node} from "@fig/types/nodes/Node"
  import {Timer} from "$lib/stores/canvasTime.svelte";
  import {keys} from "$lib/stores/keys.svelte";

  let {node}: { node: Node } = $props();

  let parts: Set<VectorPart> = $state(new Set());
  let strokePathsSynchronization: Path2D[] = $state([]);
  let strokeGeometriesCommands: PathCommand[][] = $state([]);

  let bbox = getGeometryBbox(strokeGeometriesCommands);
  let rect = new Rect(0, 0, 0, 0);

  let hovered = $state(false);
  let dblclick = $state(false);
  let editMode = $state(false);

  let editTimer = new Timer(100, "Once");

  let selectedPart: VectorPart | null = $state(null);
  let draggedPart: VectorPart | null = $state(null);

  let strokeColor = colorToString(node.node.data.strokes[0].color);
  let strokeWeight = node.node.data.strokeWeight;

  // $effect(() => {
  // if (hovered || bbox) {
  //
  // }
  // })

  // Create vector context
  setContext<VectorContext>("vector", {
    register,
    unregister,
    setSelectedPart,
    setDraggedPart,
    resetDraggedPart,
    isDragged,
    stroke_geometries_commands: strokeGeometriesCommands,
  });

  // Parse all geometries path to an array of PathCommand
  if (node.node.type === "vector") {
    let strokeGeometry = node.node.data.strokeGeometry;
    for (const geometry of strokeGeometry) {
      strokeGeometriesCommands.push(parsePathString(normalize(geometry.path)))
    }
  } else {
    console.error(`${node.name} isn't an vector.`);
  }

  // Register and unregister vector node
  let canvasNode: CanvasNode = {
    draw,
    update,
    node: node
  };

  let context = getContext<CanvasContext>("canvas");
  context.register(canvasNode);
  onDestroy(() => {
    context.unregister(canvasNode);
  });

  // Functions
  function draw(ctx: CanvasRenderingContext2D) {

    // Draw bounding box
    if (!editMode && hovered) {
      strokeRect({
        ctx,
        x: navigation.toVirtualX(bbox.center.x),
        y: navigation.toVirtualY(bbox.center.y),
        width: bbox.width + strokeWeight + 2,
        height: bbox.height + strokeWeight + 2,
        color: getPrimitiveBlue(),
        strokeWidth: 2,
      })
    }

    // Update string paths commands of node
    strokePathsSynchronization = [];
    for (const geometriesCommand of strokeGeometriesCommands) {
      let path = new Path2D(serializeCommands(navigation.toVirtualGeometryCommand(geometriesCommand)));
      strokePathsSynchronization.push(path)
    }

    if (node.node.type === "vector") {
      // draw stylized vector
      for (let path of strokePathsSynchronization) {
        drawPath({
          ctx,
          path,
          colors: {stroke: strokeColor},
          strokeWeight
        });
      }

      // draw vector skeleton on hover
      if (!editMode && hovered) {
        for (let path of strokePathsSynchronization) {
          drawPath({
            ctx,
            path,
            colors: {stroke: getPrimitiveWhite()}
          });
        }
      }

      // draw all parts
      if (editMode) {
        for (const part of parts) {
          part.draw(ctx);
        }
      }
    } else {
      console.error(`${node.name} isn't a vector.`);
    }
  }

  function update() {
    updateRect();
    hovered = rect.hovered();
    dblclick = hovered && canvasClick.double;

    // Toggle edit mode when double click
    if (dblclick && !editMode && editTimer.finished()) {
      editMode = true;
      editTimer.reset();
    } else if (canvasClick.double && editMode && editTimer.finished()) {
      editMode = false;
      editTimer.reset();
    }

    // Exit edit mode when pressing enter or escape
    if (editMode && keys.isPressed("Enter") || keys.isPressed("Escape")) {
      editMode = false;
    }

    // Update parts
    for (const part of parts) {
      part.update();
    }
  }

  function updateRect() {
    bbox = getGeometryBbox(strokeGeometriesCommands);
    rect.update(navigation.toVirtualX(bbox.min.x), navigation.toVirtualY(bbox.min.y), bbox.width + strokeWeight / 2, bbox.height + strokeWeight / 2);
  }

  function register(part: VectorPart) {
    onMount(() => {
      parts.add(part);
    });

    // $effect(() => {
    //   if (scheduled) return;
    //
    //   scheduled = true;
    //   scheduled = false;
    //
    //   context.redraw();
    // });
  }

  function unregister(part: VectorPart) {
    parts.delete(part);
  }

  function setSelectedPart(part: VectorPart | null) {
    if (part) {
      part.selected = true;
    }

    if (selectedPart) {
      selectedPart.selected = false;
    }
    selectedPart = part;
  }

  function setDraggedPart(part: VectorPart) {
    if (!draggedPart && part) {
      draggedPart = part;
    }
  }

  function resetDraggedPart(from: VectorPart) {
    // only the drag part can be reset the draggedPart
    if (draggedPart && from && draggedPart.id === from.id) {
      draggedPart = null;
    }
  }

  /**
   * Checks whether the part passed in parameter is the one being dragged
   */
  function isDragged(part: VectorPart) {
    if (draggedPart) {
      return part.id === draggedPart.id;
    } else {
      return null;
    }
  }

</script>

{#if (editMode)}
  {#each strokeGeometriesCommands as path_commands, gi}
    {#each path_commands as command, i}

      <!-- Draw lines -->
      {#if (command.type === "Z")}
        <VectorLine geometryIndex={gi} startIndex={i - 1} endIndex={0}/>
      {:else if (i < path_commands.length - 1 && (command.type === "M" || command.type === "L"))}
        {#if path_commands[i + 1]?.endPoint}
          <VectorLine geometryIndex={gi} startIndex={i} endIndex={i + 1}/>
        {/if}
      {/if}

      <!-- Draw points -->
      {#if ((command.type === "M" || command.type === "L"))}
        <VectorPoint geometryIndex={gi} pointIndex={i}/>
      {/if}
    {/each}
  {/each}
{/if}
