#![allow(dead_code)]

use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Node {
    /// A string uniquely identifying this node within the document.
    id: String,
    /// The name given to the node by the user in the tool.
    name: String,
    /// Whether or not the node is visible on the canvas.
    visible: bool,
    /// The type of the node.
    ntype: NodeType,
    /// The rotation of the node, if not 0.
    rotation: i32
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub enum NodeType {
    Document(DocumentNode),
    Canvas(CanvasNode),
    Vector(VectorNode)
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct DocumentNode {
    /// An array of canvases attached to the document.
    children: Vec<Node>
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct CanvasNode {
    /// An array of top level layers on the canvas
    children: Vec<Node>,
    //// Background color of the canvas.
    // background_color: Color,
    //// An array of export settings representing images to export from the canvas
    // export_settings: Vec<ExportSetting>
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct VectorNode {
    /// If true, layer is locked and cannot be edited.
    locked: bool,
    //// An array of export settings representing images to export from the node.
    // export_settings: Vec<ExportSetting>,
    //// How this node blends with nodes behind it in the scene
    // blend_mode: BlendMode,
    /// Keep height and width constrained to same ratio
    preserve_ratio: bool,
    // layout_align: LayoutAlign,
    layout_grow: i32,
    // constraint: LayoutConstraint,
    opacity: f32,
    // absolute_bounding_box: Rectangle,
    // absolute_render_bounds: Option<Rectangle>,
    // effects: Vec<Effect>,
    // size: Vector or Size ?
    // fills: Vec<Paint>,
    // fill_geometry: Vec<Path>,
    // strokes: Vec<Paint>,
    stroke_weight: i32,
    // individual_stroke_weights: StrokeWeights,
    // stroke_cap: StrokeCap,
    stroke_dashes: Vec<i32>,
    // stroke_geometry: Vec<Path>,
    // stroke_align: StrokeAlign,
}
