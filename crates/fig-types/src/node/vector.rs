use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::properties::{BlendMode, Effect, LayoutConstraint, Paint, Path, Rectangle, Size, StrokeWeights};


#[derive(Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct VectorNode<Data> {
    /// If true, layer is locked and cannot be edited.
    locked: bool,
    //// An array of export settings representing images to export from the node.
    // export_settings: Vec<ExportSetting>,
    //// How this node blends with nodes behind it in the scene
    blend_mode: BlendMode,
    /// Keep height and width constrained to same ratio
    preserve_ratio: bool,
    // layout_align: LayoutAlign,
    layout_grow: i32,
    constraint: LayoutConstraint,
    opacity: f32,
    /// Bounding box of the node in absolute space coordinates
    absolute_bounding_box: Rectangle,
    /// The actual bounds of a node accounting for drop shadows, thick strokes, and anything else that may fall outside the node's regular bounding box defined in x, y, width, and height. The x and y inside this property represent the absolute position of the node on the page. This value will be null if the node is invisible.
    absolute_render_bounds: Option<Rectangle>,
    effects: Vec<Effect>,
    size: Size,
    fills: Vec<Paint>,
    fill_geometry: Vec<Path>,
    strokes: Vec<Paint>,
    stroke_weight: i32,
    individual_stroke_weights: StrokeWeights,
    // stroke_cap: StrokeCap,
    stroke_dashes: Vec<i32>,
    stroke_geometry: Vec<Path>,
    // stroke_align: StrokeAlign,
    addidional_data: Data
}


#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct EmptyData {}


#[derive(Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct RectangleNode {
    corner_radius: f32,
    rectangle_corner_radii: [f32; 4],
    corner_smoothing: f32
}

