#[allow(dead_code)]

/// An RGBA color
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
pub struct RGBColor {
    /// Red channel value, between 0 and 1
    r: f32,
    /// Green channel value, between 0 and 1
    g: f32,
    /// Blue channel value, between 0 and 1
    b: f32,
}

/// Format and size to export an asset at
pub struct ExportSetting {
    /// File suffix to append to all filenames
    suffix: String,
    /// Image type, string enum that supports values JPG, PNG, and SVG
    format: FormatType,
    /// Constraint that determines sizing of exported asset
    constraint: Constraint,
}

/// Enum describing format type
pub enum FormatType {
    JPG,
    PNG,
    SVG,
}

/// Sizing constraint for exports
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
pub enum ConstraintType {
    SCALE, /// Scale by value
    WIDTH, /// Scale proportionally and set width to value
    HEIGHT, /// Scale proportionally and set height to value
}

/// A rectangle that expresses a bounding box in absolute coordinates
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
pub struct ArcData {
    /// Start of the sweep in radians
    startingAngleNumber: i32,
    /// End of the sweep in radians
    endingAngle: i32,
    /// Inner radius value between 0 and 1
    innerRadius: f32,
}

/// Enum describing how layer blends with layers below
pub enum BlendMode {
    /// This type is a string enum with the following possible values
    /// Normal blends:
    PASS_THROUGH, /// (only applicable to objects with children)
    NORMAL,

    /// Darken:
    DARKEN,
    MULTIPLY,
    LINEAR_BURN, /// ("Plus darker" in Figma)
    COLOR_BURN,

    /// Lighten:
    LIGHTEN,
    SCREEN,
    LINEAR_DODGE, /// ("Plus lighter" in Figma)
    COLOR_DODGE,

    /// Contrast:
    OVERLAY,
    SOFT_LIGHT,
    HARD_LIGHT,

    /// Inversion:
    DIFFERENCE,
    EXCLUSION,

    /// Component:
    HUE,
    SATURATION,
    COLOR,
    LUMINOSITY,
}

/// Enum describing how mask layer operates on the pixels of the layers it masks.
pub enum MaskType {
    /// This type is a string enum with the following possible values:
    ALPHA, /// The mask node's alpha channel will be used to determine the opacity of each pixel in the masked result.
    VECTOR, /// If the mask node has visible fill paints, every pixel inside the node's fill regions will be fully visible in the masked result. If the mask has visible stroke paints, every pixel inside the node's stroke regions will be fully visible in the masked result.
    LUMINANCE, /// The luminance value of each pixel of the mask node will be used to determine the opacity of that pixel in the masked result.
}

/// Enum describing animation easing curves
pub enum EasingType {
    /// This type is a string enum with the following possible values
    EASE_IN, /// Ease in with an animation curve similar to CSS ease-in.
    EASE_OUT, /// Ease out with an animation curve similar to CSS ease-out.
    EASE_IN_AND_OUT, /// Ease in and then out with an animation curve similar to CSS ease-in-out.
    LINEAR, /// No easing, similar to CSS linear.
    GENTLE_SPRING, /// Gentle spring animation similar to react-spring.
}

/// A flow starting point used when launching a prototype to enter Presentation view.
pub struct FlowStartingPoint {
    /// Unique identifier specifying the frame
    nodeId: String,
    /// Name of flow
    name: String,
}

/// Layout constraint relative to containing Frame
pub struct LayoutConstraint {
    /// Vertical constraint as an enum
    vertical: String,
    /// TOP: Node is laid out relative to top of the containing frame
    /// BOTTOM: Node is laid out relative to bottom of the containing frame
    /// CENTER: Node is vertically centered relative to containing frame
    /// TOP_BOTTOM: Both top and bottom of node are constrained relative to containing frame (node stretches with frame)
    /// SCALE: Node scales vertically with containing frame

    /// Horizontal constraint as an enum
    horizontal: String,
    /// LEFT: Node is laid out relative to left of the containing frame
    /// RIGHT: Node is laid out relative to right of the containing frame
    /// CENTER: Node is horizontally centered relative to containing frame
    /// LEFT_RIGHT: Both left and right of node are constrained relative to containing frame (node stretches with frame)
    /// SCALE: Node scales horizontally with containing frame
}

///
pub enum LayoutConstraintVertical {
    
}

