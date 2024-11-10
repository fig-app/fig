<script lang="ts">
  import type {CanvasNode} from "$lib/types/CanvasNode";
  import {onMount} from "svelte";
  import type {VectorPart} from "$lib/types/VectorPart";
  import {parsePathString} from "@fig/functions/path/index";
  import {normalize} from "@fig/functions/path/normalize";
  import {serializeCommands} from "@fig/functions/path/serialize";
  import {drawPath} from "$lib/primitive/path";
  import {colorToString, getPrimitiveBlue, getPrimitiveWhite} from "@fig/functions/color";
  import type {PathCommand, PathCommandWithEndPoint} from "@fig/functions/path/PathCommand";
  import {navigation} from "$lib/stores/navigation.svelte";
  import {getGeometryBbox} from "@fig/functions/path/bBox";
  import {Rect} from "$lib/Rect.svelte";
  import {rect, strokeRect} from "$lib/primitive/rect";
  import type {Node} from "@fig/types/nodes/Node"
  import {Timer} from "$lib/stores/canvasTime.svelte";
  import {getCanvasContext, registerCanvasNode} from "$lib/context/canvasContext";
  import {getVectorContext, setVectorContext} from "$lib/context/vectorContext";
  import type {VectorNode} from "@fig/types/nodes/vector/VectorNode";
  import type {EmptyData} from "@fig/types/nodes/vector/EmptyData";
  import {canvasColors} from "$lib/stores/canvasColors";
  import {canvasClick} from "$lib/stores/canvasClick.svelte";
  import {keys} from "$lib/stores/keys.svelte";
  import {commandHasEndPoint} from "@fig/functions/path/typeCheck";
  import {vectorToString} from "@fig/functions/vector";
  import VectorPoint from "$lib/components/VectorPoint.svelte";
  import VectorLine from "$lib/components/VectorLine.svelte";
  import VectorCurve from "$lib/components/VectorCurve.svelte";
  import {selector} from "$lib/components/Selector.svelte";
  import type {Line} from "@fig/types/shapes/Line";
  import {cursorPosition} from "$lib/stores/cursorPosition.svelte";
  import type {Curve} from "@fig/types/shapes/Curve";
  import {canvasRenderingContext} from "$lib/stores/canvasRenderingContext.svelte";
  import {getHoverMarginDistance} from "@fig/functions/distance";

  let {node}: { node: Node } = $props();

  if (node.node.type !== "vector") {
    console.error(`${node.name} isn't a vector.`);
  }

  let data = node.node.data as VectorNode<EmptyData>

  let parts: Set<VectorPart> = $state(new Set());

  let strokePathsSynchronization: Path2D[] = $state([]);
  let strokeGeometriesCommands: PathCommand[][] = $state([]);

  let bbox = $derived(getGeometryBbox(strokeGeometriesCommands));

  let hovered: boolean = $state(false);
  let dblclick: boolean = $state(false);
  let editMode: boolean = $state(false);
  let triggerUpdate: boolean = $state(false);

  let editTimer = new Timer(100, "Once");
  let keyTimer = new Timer(100, "Repeating");

  let draggedPart: VectorPart | null = $state(null);

  let strokeColor = colorToString(data.strokes[0].color);
  let strokeWeight = $derived(data.strokeWeight * navigation.scale);

  let canvasContext = getCanvasContext();
  let vectorContext = getVectorContext();

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

  // Get all commands with end points.
  // Here a command is defined thanks to its geometryIdx and its own idx in the geometry
  function getCommandsWithEndPoints() {
    let listOfCommands: [number, number][] = [];
    for (const [gi, geometry] of strokeGeometriesCommands.entries()) {
      for (const [i, command] of geometry.entries()) {
        if (commandHasEndPoint(command)) {
          listOfCommands.push([gi, i]);
        }
      }
    }
    return listOfCommands;
  }

  // Associate each end point to the list of [geometryIdx, commandIdx] that have this end point
  // key : string of {x, y} to represent the coordinates
  // value : array of MLT or C Path commands, which are the only ones useful to have endpoints
  function getPointsAndCoordinates() {
    let to_ret: { [key: string]: [number, number][] } = {};
    getCommandsWithEndPoints().forEach(commandTuple => {
      let command = strokeGeometriesCommands[commandTuple[0]][commandTuple[1]] as PathCommandWithEndPoint;
      const key = vectorToString(command.endPoint);
      if (!to_ret[key]) {
        to_ret[key] = [];
      }
      to_ret[key].push(commandTuple);
    });
    return to_ret;
  }

  let pointsAndCoordinates: { [key: string]: [number, number][] } = $derived.by(() => {
    return getPointsAndCoordinates();
  });

  // TO KEEP EVEN IF USELESS FOR NOW : Get all vector parts' shape (lines & curve) of the vector (for the hover)
  let allLines: Line[] = $derived.by(() => {
    let allLines: Line[] = [];
    for (const [gi, geometry] of strokeGeometriesCommands.entries()) {
      for (const [i, command] of geometry.entries()) {
        const prevCommand = strokeGeometriesCommands[gi][i - 1] as PathCommandWithEndPoint;
        const firstCommand = strokeGeometriesCommands[gi][0] as PathCommandWithEndPoint;
        if (command.type === 'L') {
          allLines.push({
            start: navigation.toVirtualPoint(prevCommand.endPoint),
            end: navigation.toVirtualPoint(command.endPoint),
          })
        } else if (command.type === 'Z') {
          allLines.push({
            start: navigation.toVirtualPoint(prevCommand.endPoint),
            end: navigation.toVirtualPoint(firstCommand.endPoint),
          })
        }
      }
    }
    return allLines;
  })
  let allCurves: Curve[] = $derived.by(() => {
    let allCurves: Curve[] = [];
    for (const [gi, geometry] of strokeGeometriesCommands.entries()) {
      for (const [i, command] of geometry.entries()) {
        const prevCommand = strokeGeometriesCommands[gi][i - 1] as PathCommandWithEndPoint;
        const firstCommand = strokeGeometriesCommands[gi][0] as PathCommandWithEndPoint;
        if (command.type === 'C') {
          allCurves.push({
            start: navigation.toVirtualPoint(prevCommand.endPoint),
            end: navigation.toVirtualPoint(command.endPoint),
            startControl: command.controlPoints.start,
            endControl: command.controlPoints.end,
          })
        }
      }
    }
    return allCurves;
  })

  // Register vector node
  let canvasNode: CanvasNode = $state({
    draw,
    update,
    node: node,
    selected: false,
    boundingBox: Rect.new(),
  });

  registerCanvasNode(canvasNode);

  // Several functions to get the different parts according to their type.
  // It allows to render them in a specific order (to kind of handle z-index)
  function getVectorPoints(): VectorPart[] {
    let list: VectorPart[] = [];
    parts.forEach(part => {
      if (part.type == "point") {
        list.push(part);
      }
    })
    return list;
  }

  function getVectorLines(): VectorPart[] {
    let list: VectorPart[] = [];
    parts.forEach(part => {
      if (part.type == "line") {
        list.push(part);
      }
    })
    return list;
  }

  function getVectorCurves(): VectorPart[] {
    let list: VectorPart[] = [];
    parts.forEach(part => {
      if (part.type == "curve") {
        list.push(part);
      }
    })
    return list;
  }

  function getVectorControlPoint(): VectorPart[] {
    let list: VectorPart[] = [];
    parts.forEach(part => {
      if (part.type == "controlPoint") {
        list.push(part);
      }
    })
    return list;
  }

  // ######################################################
  // BEGIN DRAW
  // ######################################################
  function draw(ctx: CanvasRenderingContext2D) {
    // Draw bounding box
    if (!editMode && canvasNode.selected) {
      // Draw bounding box of the node
      strokeRect({
        ctx,
        x: canvasNode.boundingBox.center.x,
        y: canvasNode.boundingBox.center.y,
        width: canvasNode.boundingBox.width,
        height: canvasNode.boundingBox.height,
        color: canvasColors.blue,
        strokeWidth: 2,
      });

      // Draw 4 drag squares to corners of the bounding rect
      for (const corner of canvasNode.boundingBox.corners) {
        rect({
          ctx,
          x: corner.x,
          y: corner.y,
          width: 10,
          height: 10,
          colors: {
            stroke: getPrimitiveBlue(),
            background: getPrimitiveWhite(),
          },
          radius: 0,
          rotation: 0,
          strokeWeight: 2,
        });
      }
    }

    // Update string paths commands of node
    // This is necessary to update stylized and skeleton drawings
    strokePathsSynchronization = [];
    for (const geometriesCommand of strokeGeometriesCommands) {
      let path = new Path2D(serializeCommands(navigation.toVirtualGeometryCommand(geometriesCommand)));
      strokePathsSynchronization.push(path)
    }

    // Draw stylized vector
    for (let path of strokePathsSynchronization) {
      drawPath({
        ctx,
        path,
        colors: {stroke: strokeColor},
        strokeWeight
      });
    }

    // Draw vector skeleton on hover
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

    // Draw all parts
    if (editMode) {
      for (const part of parts) {
        part.draw(ctx);
      }
    }
  }

  // ######################################################
  // END DRAW
  // ######################################################

  function isVectorHovered(): boolean {
    for (const path of strokePathsSynchronization) {
      if (canvasRenderingContext.ctx) {
        canvasRenderingContext.ctx.lineWidth = Math.max(getHoverMarginDistance(), navigation.scale);
        if (canvasRenderingContext.ctx.isPointInStroke(path, cursorPosition.x, cursorPosition.y)) {
          return true;
        }
      }
    }

    return false;
  }

  // ######################################################
  // BEGIN UPDATE
  // ######################################################
  function update() {
    // Update bounding box size and coordinates
    updateBoundingBox();
    // Updating hovered state
    hovered = isVectorHovered();
    dblclick = hovered && canvasClick.double;

    // Check for selection with selector rectangle
    if (selector.rect && !selector.partsMode) {
      canvasNode.selected = selector.rect.collide(canvasNode.boundingBox);
    }

    // Toggle edit mode when double click
    if (dblclick && !editMode && editTimer.finished()) {
      editMode = true;
      editTimer.reset();
    } else if (canvasClick.double && editMode && editTimer.finished()) {
      editMode = false;
      editTimer.reset();
    }

    // Exit edit & fill modes when pressing enter or escape
    if (editMode && keys.isPressed("Enter") || keys.isPressed("Escape")) {
      editMode = false;
    }

    // Update parts
    if (editMode) {
      // Update in this order to prioritize hover (points > lines)
      getVectorPoints().forEach(part => {
        part.update();
      });
      getVectorControlPoint().forEach(part => {
        part.update();
      });
      getVectorLines().forEach(part => {
        part.update();
      });
      getVectorCurves().forEach(part => {
        part.update();
      });
    }

    // Move selected parts with arrow keys
    if (editMode && keyTimer.finished() && selector.hasSelectedParts() && keys.anyPressed) {
      let shiftMultiplier = keys.shiftPressed() ? 10 : 0.5;
      let xShift = (keys.isPressed("ArrowLeft") ? -1 : keys.isPressed("ArrowRight") ? 1 : 0) * shiftMultiplier;
      let yShift = (keys.isPressed("ArrowUp") ? -1 : keys.isPressed("ArrowDown") ? 1 : 0) * shiftMultiplier;

      // Move the current point or all the points if several are selected
      let selectedCommandTuples = selector.selectedPartsCommandTuples();
      for (const selectedCommandTuple of selectedCommandTuples) {
        let selectedCommand = strokeGeometriesCommands[selectedCommandTuple[0]][selectedCommandTuple[1]] as PathCommandWithEndPoint;
        selectedCommand.endPoint.x += xShift;
        selectedCommand.endPoint.y += yShift;
      }
    }
  }

  // ######################################################
  // END UPDATE
  // ######################################################

  function updateBoundingBox() {
    canvasNode.boundingBox.update(
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

  function forceCommandWithEndPoint(command: PathCommand): PathCommandWithEndPoint {
    return command as PathCommandWithEndPoint;
  }

  function getCommandTuplesList(geometryIndex: number, commandIndex: number): [number, number][] {
    return pointsAndCoordinates[vectorToString(forceCommandWithEndPoint(strokeGeometriesCommands[geometryIndex][commandIndex]).endPoint)];
  }

</script>

{#if (editMode)}
  {#key (triggerUpdate)}

    {#each strokeGeometriesCommands as path_commands, gi}
      {#each path_commands as command, i}

        <!-- Draw lines -->
        {#if (command.type === "Z")}
          <VectorLine
            startCommandTuplesList={getCommandTuplesList(gi, i - 1)}
            endCommandTuplesList={getCommandTuplesList(gi, 0)}
            geometryIndex={gi}
            startIndex={i - 1}/>
        {:else if (command.type === "L")}
          <VectorLine
            startCommandTuplesList={getCommandTuplesList(gi, i - 1)}
            endCommandTuplesList={getCommandTuplesList(gi, i)}
            geometryIndex={gi}
            startIndex={i - 1}/>
        {/if}

        <!--  Draw cubic curves -->
        {#if (command.type === "C")}
          <VectorCurve
            startCommandTuplesList={getCommandTuplesList(gi, i - 1)}
            endCommandTuplesList={getCommandTuplesList(gi, i)}
            geometryIndex={gi} startIndex={i - 1}
          />
        {/if}
      {/each}
    {/each}

    <!--  Draw points -->
    {#each Object.values(pointsAndCoordinates) as commandTuplesList}
      <VectorPoint {commandTuplesList}/>
    {/each}

  {/key}
{/if}
