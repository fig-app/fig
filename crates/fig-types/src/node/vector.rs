use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::properties::{
    Annotation, ArcData, BlendMode, EasingType, Effect, ExportSetting, LayoutAlign,
    LayoutConstraint, Paint, PaintOverride, Path, Rectangle, Size, StrokeAlign, StrokeCap,
    StrokeJoin, StrokeWeights, StyleType, Transform,
};

#[derive(Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "nodes/vector/")]
pub struct VectorNode<Data> {
    /// If true, layer is locked and cannot be edited.
    locked: bool,
    //// An array of export settings representing images to export from the node.
    export_settings: Vec<ExportSetting>,
    //// How this node blends with nodes behind it in the scene
    blend_mode: BlendMode,
    /// Keep height and width constrained to same ratio
    preserve_ratio: bool,
    /// Determines if the layer should stretch along the parent’s counter axis. This property is
    /// only provided for direct children of auto-layout frames.
    layout_align: LayoutAlign,
    /// This property is applicable only for direct children of auto-layout frames, ignored
    /// otherwise. Determines whether a layer should stretch along the parent’s primary axis. A 0
    /// corresponds to a fixed size and 1 corresponds to stretch
    layout_grow: i32,
    /// Horizontal and vertical layout constraints for node
    constraint: LayoutConstraint,
    /// Node ID of node to transition to in prototyping
    transition_node_id: Option<String>,
    /// The duration of the prototyping transition on this node (in milliseconds)
    transition_duration: Option<i32>,
    /// The easing curve used in the prototyping transition on this node
    transition_easing: EasingType,
    /// Opacity of the node
    opacity: f32,
    /// Bounding box of the node in absolute space coordinates
    absolute_bounding_box: Rectangle,
    /// The actual bounds of a node accounting for drop shadows, thick strokes, and anything else
    /// that may fall outside the node's regular bounding box defined in x, y, width, and height.
    /// The x and y inside this property represent the absolute position of the node on the page.
    /// This value will be null if the node is invisible.
    absolute_render_bounds: Option<Rectangle>,
    /// An array of effects attached to this node (see effects section for more details)
    effects: Vec<Effect>,
    /// Width and height of element. This is different from the width and height of the bounding
    /// box in that the absolute bounding box represents the element after scaling and rotation.
    /// Only present if geometry=paths is passed
    size: Size,
    /// The top two rows of a matrix that represents the 2D transform of this node relative to its
    /// parent. The bottom row of the matrix is implicitly always (0, 0, 1). Use to transform
    /// coordinates in geometry. Only present if geometry=paths is passed
    relative_transform: Transform,
    /// Does this node mask sibling nodes in front of it?
    is_mask: bool,
    /// An array of fill paints applied to the node
    fills: Vec<Paint>,
    /// Only specified if parameter geometry=paths is used. An array of paths representing the
    /// object fill
    fill_geometry: Vec<Path>,
    /// Map from ID to PaintOverride for looking up fill overrides. To see which regions are
    /// overriden, you must use the geometry=paths option. Each path returned may have an
    /// overrideId which maps to this table.
    fill_override_table: HashMap<i32, PaintOverride>,
    /// An array of stroke paints applied to the node
    strokes: Vec<Paint>,
    /// The weight of strokes on the node
    stroke_weight: i32,
    /// An object including the top, bottom, left, and right stroke weights. Only returned if
    /// individual stroke weights are used.
    individual_stroke_weights: StrokeWeights,
    /// A string enum with values describing the end caps of vector paths.
    stroke_cap: StrokeCap,
    ///  A string enum with value of "MITER", "BEVEL", or "ROUND", describing how corners in vector
    /// paths are rendered.
    stroke_join: StrokeJoin,
    /// An array of floating point numbers describing the pattern of dash length and gap lengths
    /// that the vector path follows. For example a value of [1, 2] indicates that the path has a
    /// dash of length 1 followed by a gap of length 2, repeated.
    stroke_dashes: Vec<i32>,
    /// Only valid if strokeJoin is "MITER". The corner angle, in degrees, below which strokeJoin
    /// will be set to "BEVEL" to avoid super sharp corners. By default this is 28.96 degrees.
    stroke_miter_angle: f32,
    /// Only specified if parameter geometry=paths is used. An array of paths representing the
    /// object stroke
    stroke_geometry: Vec<Path>,
    /// Position of stroke relative to vector outline, as a string enum
    stroke_align: StrokeAlign,
    /// A mapping of a StyleType to style ID (see Style) of styles present on this node. The style
    /// ID can be used to look up more information about the style in the top-level styles field.
    styles: HashMap<StyleType, String>,
    /// An array of annotations displaying notes and pinned properties of nodes in Dev Mode.
    /// Currently a maximum of 1 annotation is supported.
    annotations: Vec<Annotation>,
    addidional_data: Data,
}

/// Empty data struct
#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "nodes/vector/")]
pub struct EmptyData {}

/// Specific data for rectangle.
#[derive(Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "nodes/vector/")]
pub struct RectangleData {
    /// Radius of each corner of the rectangle if a single radius is set for all corners
    corner_radius: f32,
    /// Array of length 4 of the radius of each corner of the rectangle, starting in the top left
    /// and proceeding clockwise
    rectangle_corner_radii: [f32; 4],
    /// A value that lets you control how "smooth" the corners are. Ranges from 0 to 1. 0 is the
    /// default and means that the corner is perfectly circular. A value of 0.6 means the corner
    /// matches the iOS 7 "squircle" icon shape. Other values produce various other curves.
    corner_smoothing: f32,
}

/// Specific data for ellipse.
#[derive(Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "nodes/vector/")]
pub struct EllipseData {
    /// Start and end angles of the ellipse measured clockwise from the x axis, plus the inner
    /// radius for donuts
    arc_data: ArcData,
}
