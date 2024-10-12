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
  import {colorToString} from "@fig/functions/color";
  import type {PathCommand} from "@fig/functions/path/PathCommand";
  import {navigation} from "$lib/stores/navigation.svelte";
  import {getGeometryBbox} from "@fig/functions/path/bBox";
  import {Rect} from "$lib/Rect.svelte";
  import {strokeRect} from "$lib/primitive/rect";
  import {canvasClick} from "$lib/stores/canvasClick.svelte";
  import type {Node} from "@fig/types/nodes/Node"
  import {Timer} from "$lib/stores/canvasTime.svelte";
  import {keys} from "$lib/stores/keys.svelte";
  import {getCanvasContext, registerCanvasNode} from "$lib/context/canvasContext";
  import {setVectorContext} from "$lib/context/vectorContext";
  import type {VectorNode} from "@fig/types/nodes/vector/VectorNode";
  import type {EmptyData} from "@fig/types/nodes/vector/EmptyData";
  import VectorCurve from "$lib/components/VectorCurve.svelte";
  import {canvasColors} from "$lib/stores/canvasColors";
  import {commandHasEndPoint} from "@fig/functions/path/typeCheck";

  let {node}: { node: Node } = $props();

  if (node.node.type !== "vector") {
    console.error(`${node.name} isn't a vector.`);
  }

  let data = node.node.data as VectorNode<EmptyData>

  let parts: Set<VectorPart> = $state(new Set());

  let strokePathsSynchronization: Path2D[] = $state([]);
  let strokeGeometriesCommands: PathCommand[][] = $state([]);

  let bbox = $derived(getGeometryBbox(strokeGeometriesCommands));
  let rect = Rect.new();

  let hovered = $state(false);
  let dblclick = $state(false);
  let editMode = $state(false);
  let triggerUpdate = $state(false);

  let editTimer = new Timer(100, "Once");

  let draggedPart: VectorPart | null = $state(null);

  let strokeColor = colorToString(data.strokes[0].color);
  let strokeWeight = $derived(data.strokeWeight * navigation.scale);

  let canvasContext = getCanvasContext();

  // Force update when this variables change (trigger the redraw)
  canvasContext.updateCanvas(() => [hovered, bbox, strokeGeometriesCommands])

  // Create vector context
  setVectorContext({
    register,
    unregister,
    setDraggedPart,
    resetDraggedPart,
    isDragged,
    updateVector,
    strokeGeometriesCommands: strokeGeometriesCommands,
  });

  // Parse all geometries path to an array of PathCommand
  let strokeGeometry = data.strokeGeometry;
  for (const geometry of strokeGeometry) {
    strokeGeometriesCommands.push(parsePathString(normalize(geometry.path)))
  }

  // Register vector node
  let canvasNode: CanvasNode = $state({
    draw,
    update,
    node: node,
    selected: false
  });

  registerCanvasNode(canvasNode);

  // Functions
  function getVectorPoints(): VectorPart[] {
    let to_ret: VectorPart[] = [];
    parts.forEach(part => {
      if (part.type == "point") {
        to_ret.push(part);
      }
    })
    return to_ret;
  }

  function getVectorLines(): VectorPart[] {
    let to_ret: VectorPart[] = [];
    parts.forEach(part => {
      if (part.type == "line") {
        to_ret.push(part);
      }
    })
    return to_ret;
  }

  function getVectorCurves(): VectorPart[] {
    let to_ret: VectorPart[] = [];
    parts.forEach(part => {
      if (part.type == "curve") {
        to_ret.push(part);
      }
    })
    return to_ret;
  }

  function draw(ctx: CanvasRenderingContext2D) {

    // Draw bounding box
    if (!editMode && canvasNode.selected) {
      strokeRect({
        ctx,
        x: rect.center.x,
        y: rect.center.y,
        width: rect.width,
        height: rect.height,
        color: canvasColors.blue,
        strokeWidth: 2,
      })
    }

    // Update string paths commands of node
    strokePathsSynchronization = [];
    for (const geometriesCommand of strokeGeometriesCommands) {
      let path = new Path2D(serializeCommands(navigation.toVirtualGeometryCommand(geometriesCommand)));
      strokePathsSynchronization.push(path)
    }

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
          colors: {stroke: canvasColors.blue},
          strokeWeight: 2
        });
      }
    }

    // draw all parts
    if (editMode) {
      for (const part of parts) {
        part.draw(ctx);
      }
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
    if (editMode) {
      // Update in this order to prioritize hover (points > lines)
      getVectorPoints().forEach(part => {
        part.update();
      });
      getVectorCurves().forEach(part => {
        part.update();
      });
      getVectorLines().forEach(part => {
        part.update();
      });
    }
  }

  function updateRect() {
    rect.update(
      navigation.toVirtualX(bbox.min.x),
      navigation.toVirtualY(bbox.min.y),
      (bbox.width) * navigation.scale,
      (bbox.height) * navigation.scale
    );
  }

  function register(part: VectorPart) {
    onMount(() => {
      parts.add(part);
    });
  }

  function unregister(part: VectorPart) {
    parts.delete(part);
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
  {#key (triggerUpdate)}
    {#each strokeGeometriesCommands as path_commands, gi}
      {#each path_commands as command, i}

        <!-- Draw points -->
        {#if (commandHasEndPoint(command))}
          <VectorPoint geometryIndex={gi} pointIndex={i}/>
        {/if}

        <!-- Draw lines -->
        {#if (command.type === "Z")}
          <VectorLine geometryIndex={gi} startIndex={i - 1} endIndex={0}/>
        {:else if (command.type === "L")}
          <VectorLine geometryIndex={gi} startIndex={i - 1} endIndex={i}/>
        {/if}

        <!--  Draw cubic curves -->
        {#if (command.type === "C")}
          <VectorCurve geometryIndex={gi} startIndex={i - 1} endIndex={i}/>
        {/if}
      {/each}
    {/each}
  {/key}
{/if}
