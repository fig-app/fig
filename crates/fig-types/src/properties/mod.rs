#[allow(dead_code)]

use serde::{Deserialize, Serialize};
use ts_rs::TS;


/// An RGBA color
#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Color {
    /// Red channel value, between 0 and 1
    r: f32,
    /// Green channel value, between 0 and 1
    g: f32,
    /// Blue channel value, between 0 and 1
    b: f32,
    /// Alpha channel value, between 0 and 1
    a: f32,
}

/// An RBG Color
#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct RGBColor {
    /// Red channel value, between 0 and 1
    r: f32,
    /// Green channel value, between 0 and 1
    g: f32,
    /// Blue channel value, between 0 and 1
    b: f32,
}

/// Format and size to export an asset at
#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct ExportSetting {
    /// File suffix to append to all filenames
    suffix: String,
    /// Image type, string enum that supports values JPG, PNG, and SVG
    format: FormatType,
    /// Constraint that determines sizing of exported asset
    constraint: Constraint,
}

/// Enum describing format type
#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub enum FormatType {
    JPG,
    PNG,
    SVG,
}

/// Sizing constraint for exports
#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Constraint {
    /// Type of constraint to apply; string enum with potential values below
    /// SCALE: Scale by value
    /// WIDTH: Scale proportionally and set width to value
    /// HEIGHT: Scale proportionally and set height to value
    ctype: ConstraintType,
    /// See ctype property for effect of this field 
    value: f32,
}

/// Enum describing type of constraint
#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub enum ConstraintType {
    /// Scale by value
    Scale,
    /// Scale proportionally and set width to value
    Width,
    /// Scale proportionally and set height to value
    Height,
}

/// A rectangle that expresses a bounding box in absolute coordinates
#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Rectangle {
    /// X coordinate of top left corner of the rectangle
    x: i32,
    /// Y coordinate of top left corner of the rectangle
    y: i32,
    /// Width of the rectangle
    width: i32,
    /// Height of the rectangle
    height: i32,
}

/// Information about the arc properties of an ellipse. 0° is the x axis and increasing angles rotate clockwise
#[derive(Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct ArcData {
    /// Start of the sweep in radians
    starting_angle_number: i32,
    /// End of the sweep in radians
    ending_angle: i32,
    /// Inner radius value between 0 and 1
    inner_radius: f32,
}

/// Enum describing how layer blends with layers below
/// This type is a string enum with the following possible values
#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub enum BlendMode {
    /// Normal blends:
    /// (only applicable to objects with children)
    PassThrough,
    Normal,

    /// Darken:
    Darken,
    Multiply,
    LinearBurn, /// ("Plus darker" in Figma)
    ColorBurn,

    /// Lighten:
    Lighten,
    Screen,
    LinearDodge, /// ("Plus lighter" in Figma)
    ColorDodge,

    /// Contrast:
    Overlay,
    SoftLight,
    HardLight,

    /// Inversion:
    Difference,
    Exclusion,

    /// Component:
    Hue,
    Saturation,
    Color,
    Luminosity,
}

/// Enum describing how mask layer operates on the pixels of the layers it masks.
#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub enum MaskType {
    /// The mask node's alpha channel will be used to determine the opacity of each pixel in the masked result.
    Alpha,
    /// If the mask node has visible fill paints, every pixel inside the node's fill regions will be fully visible in the masked result. If the mask has visible stroke paints, every pixel inside the node's stroke regions will be fully visible in the masked result.
    Vector,
    /// The luminance value of each pixel of the mask node will be used to determine the opacity of that pixel in the masked result.
    Luminance,
}

/// Enum describing animation easing curves
#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub enum EasingType {
    /// Ease in with an animation curve similar to CSS ease-in.
    EaseIn,
    /// Ease out with an animation curve similar to CSS ease-out.
    EaseOut,
    /// Ease in and then out with an animation curve similar to CSS ease-in-out.
    EaseInAndOut,
    /// No easing, similar to CSS linear.
    Linear,
    /// Gentle spring animation similar to react-spring.
    GentleSpring,
}

/// A flow starting point used when launching a prototype to enter Presentation view.
#[derive(Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct FlowStartingPoint {
    /// Unique identifier specifying the frame
    node_id: String,
    /// Name of flow
    name: String,
}

/// Layout constraint relative to containing Frame
#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct LayoutConstraint {
    /// Vertical constraint as an enum
    vertical: LayoutVerticalConstraint,

    /// Horizontal constraint as an enum
    horizontal: LayoutHorizontalConstraint,
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub enum LayoutVerticalConstraint {
    /// Node is laid out relative to top of the containing frame
    Top,
    /// Node is laid out relative to bottom of the containing frame
    Bottom,
    /// Node is vertically centered relative to containing frame
    Center,
    /// Both top and bottom of node are constrained relative to containing frame (node stretches with frame)
    TopBottom,
    /// Node scales vertically with containing frame
    Scale
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub enum LayoutHorizontalConstraint {
    /// Node is laid out relative to left of the containing frame
    Left,
    /// Node is laid out relative to right of the containing frame
    Right,
    /// Node is horizontally centered relative to containing frame
    Center,
    /// Both left and right of node are constrained relative to containing frame (node stretches with frame)
    LeftRight,
    /// Node scales horizontally with containing frame
    Scale
}

///
#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub enum LayoutConstraintVertical {
    
}

