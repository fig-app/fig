<script lang="ts">
  import type {CanvasNode} from "$lib/types/CanvasNode";
  import {onMount} from "svelte";
  import type {VectorPart} from "$lib/types/VectorPart";
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
  import {navigation} from "$lib/stores/navigation.svelte";
  import {getGeometryBbox} from "@fig/functions/path/bBox";
  import {Rect} from "$lib/Rect.svelte";
  import {strokeRect} from "$lib/primitive/rect";
  import {canvasClick} from "$lib/stores/canvasClick.svelte";
  import type {Node} from "@fig/types/nodes/Node"
  import {Timer} from "$lib/stores/canvasTime.svelte";
  import {keys} from "$lib/stores/keys.svelte";
  import {
    getCanvasContext,
    registerCanvasNode
  } from "$lib/context/canvasContext";
  import {getVectorContext, setVectorContext} from "$lib/context/vectorContext";

  let {node}: { node: Node } = $props();

  let parts: Set<VectorPart> = $state(new Set());
  let strokePathsSynchronization: Path2D[] = $state([]);
  let strokeGeometriesCommands: PathCommand[][] = $state([]);

  let bbox = $derived(getGeometryBbox(strokeGeometriesCommands));
  let rect = new Rect(0, 0, 0, 0);

  let hovered = $state(false);
  let dblclick = $state(false);
  let selected = $state(false);
  let editMode = $state(false);
  let triggerUpdate = $state(false);

  let editTimer = new Timer(100, "Once");

  let selectedPart: VectorPart | null = $state(null);
  let draggedPart: VectorPart | null = $state(null);

  let strokeColor = colorToString(node.node.data.strokes[0].color);
  let strokeWeight = $derived(node.node.data.strokeWeight * navigation.scale);

  let canvasContext = getCanvasContext();
  let vectorContext = getVectorContext();

  // Force update when this variables change (trigger the redraw)
  canvasContext.updateCanvas(() => [hovered, bbox])

  // Create vector context
  setVectorContext({
    register,
    unregister,
    setSelectedPart,
    setDraggedPart,
    resetDraggedPart,
    isDragged,
    updateVector,
    strokeGeometriesCommands: strokeGeometriesCommands,
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

  // Register vector node
  let canvasNode: CanvasNode = {
    draw,
    update,
    node: node
  };

  registerCanvasNode(canvasNode);

  // Functions
  function draw(ctx: CanvasRenderingContext2D) {

    // Draw bounding box
    if (!editMode && hovered) {
      strokeRect({
        ctx,
        x: rect.center.x,
        y: rect.center.y,
        width: rect.width,
        height: rect.height,
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

  function drawTransformCorner(ctx: CanvasRenderingContext2D) {

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
    rect.update(navigation.toVirtualX(bbox.min.x), navigation.toVirtualY(bbox.min.y), (bbox.width) * navigation.scale, (bbox.height) * navigation.scale);
  }

  function register(part: VectorPart) {
    onMount(() => {
      parts.add(part);
    });
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

  /**
   * Resets the dragged part if the provided part
   * matches the currently dragged part.
   *
   * @param {VectorPart} from - The part to check against the currently dragged part.
   */
  function resetDraggedPart(from: VectorPart) {
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

  function updateVector() {
    triggerUpdate = !triggerUpdate;
  }

</script>

{#if (editMode)}
  {#key triggerUpdate}
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
  {/key}
{/if}
