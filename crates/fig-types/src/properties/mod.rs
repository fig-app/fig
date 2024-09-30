use std::collections::HashMap;

#[allow(dead_code)]

use serde::{Deserialize, Serialize};
use ts_rs::TS;

/// An RGBA color
#[derive(Debug, Serialize, Deserialize)]
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
#[derive(Debug, Serialize, Deserialize)]
pub struct RGBColor {
    /// Red channel value, between 0 and 1
    r: f32,
    /// Green channel value, between 0 and 1
    g: f32,
    /// Blue channel value, between 0 and 1
    b: f32,
}

/// Format and size to export an asset at
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/export/")]
pub struct ExportSetting {
    /// File suffix to append to all filenames
    suffix: String,
    /// Image type, string enum that supports values JPG, PNG, and SVG
    format: FormatType,
    /// Constraint that determines sizing of exported asset
    constraint: Constraint,
}

/// Enum describing format type
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/export/")]
pub enum FormatType {
    JPG,
    PNG,
    SVG,
}

/// Sizing constraint for exports
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/constraint/")]
pub struct Constraint {
    /// Type of constraint to apply; string enum with potential values below
    /// SCALE: Scale by value
    /// WIDTH: Scale proportionally and set width to value
    /// HEIGHT: Scale proportionally and set height to value
    constraint_type: ConstraintType,
    /// See ctype property for effect of this field 
    value: f32,
}

/// Enum describing type of constraint
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/constraint/")]
pub enum ConstraintType {
    /// Scale by value
    Scale,
    /// Scale proportionally and set width to value
    Width,
    /// Scale proportionally and set height to value
    Height,
}

/// A rectangle that expresses a bounding box in absolute coordinates
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
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
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
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
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
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
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub enum MaskType {
    /// The mask node's alpha channel will be used to determine the opacity of each pixel in the masked result.
    Alpha,
    /// If the mask node has visible fill paints, every pixel inside the node's fill regions will be fully visible in the masked result. If the mask has visible stroke paints, every pixel inside the node's stroke regions will be fully visible in the masked result.
    Vector,
    /// The luminance value of each pixel of the mask node will be used to determine the opacity of that pixel in the masked result.
    Luminance,
}

/// Enum describing animation easing curves
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/easing/")]
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
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct FlowStartingPoint {
    /// Unique identifier specifying the frame
    node_id: String,
    /// Name of flow
    name: String,
}

/// Layout constraint relative to containing Frame
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/layout/")]
pub struct LayoutConstraint {
    /// Vertical constraint as an enum
    vertical: LayoutConstraintVertical,
    /// Horizontal constraint as an enum
    horizontal: LayoutConstraintHorizontal,
}

/// Enum describing vertical layout constraint
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/layout/")]
pub enum LayoutConstraintVertical {
    /// Node is laid out relative to top of the containing frame
    Top, 
    /// Node is laid out relative to bottom of the containing frame
    Bottom, 
    /// Node is vertically centered relative to containing frame
    Center, 
    /// Both top and bottom of node are constrained relative to containing frame (node stretches with frame)
    TopBottom, 
    /// Node scales vertically with containing frame
    Scale, 
}

/// Enum describing horizontal layout constraint
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/layout/")]
pub enum LayoutConstraintHorizontal {
    /// Node is laid out relative to left of the containing frame
    Left,
    /// Node is laid out relative to right of the containing frame
    Right,
    /// Node is horizontally centered relative to containing frame
    Center,
    /// Both left and right of node are constrained relative to containing frame (node stretches with frame)
    LeftRight,
    /// Node scales horizontally with containing frame
    Scale,
}

/// Guides to align and place objects within a frame
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/layout/")]
pub struct LayoutGrid {
    /// Orientation of the grid as a string enum
    /// COLUMNS: Vertical grid
    /// ROWS: Horizontal grid
    /// GRID: Square grid
    pattern: LayoutGridPattern,
    /// Width of column grid or height of row grid or square grid spacing
    section_size: i32,
    /// Is the grid currently visible?
    visible: bool,
    /// Color of the grid
    color: Color,

    /// The following properties are only meaningful for directional grids (COLUMNS or ROWS)

    /// Positioning of grid as a string enum
    /// MIN: Grid starts at the left or top of the frame
    /// STRETCH: Grid is stretched to fit the frame
    /// CENTER: Grid is center aligned
    alignment: LayoutGridAlignment,
    /// Spacing in between columns and rows
    gutter_size: i32,
    /// Spacing before the first column or row
    offset: i32,
    /// Number of columns or rows
    count: i32,
    /// A mapping of field to the VariableAlias of the bound variable
    bound_variables: HashMap<String, VariableAlias>,
}

/// Enum describing pattern of LayoutGrid
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/layout/")]
pub enum LayoutGridPattern {
    /// Vertical grid
    Columns,
    /// Horizontal grid
    Rows,
    /// Square grid
    Grid, 
}

/// Enum describing alignment of LayoutGrid
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/layout/")]
pub enum LayoutGridAlignment {
    /// Grid starts at the left or top of the frame
    Min,
    /// Grid is stretched to fit the frame
    Stretch,
    /// Grid is center aligned
    Center,
}

/// Determines if the layer should stretch along the parent’s counter axis. This property is only provided for direct children of auto-layout frames.
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/layout/")]
pub enum LayoutAlign {
    Inherit,
    Stretch,
    Min,
    Center,
    Max,
}

/// A visual effect such as a shadow or blur
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct Effect {
    /// Type of effect as a string enum
    effect_type: EffectType,
    /// Is the effect active?
    visible: bool,
    /// Radius of the blur effect (applies to shadows as well)
    radius: i32,

    /// The following properties are for shadows only:
    
    /// The color of the shadow
    color: Color,
    /// Blend mode of the shadow
    blend_mode: BlendMode,
    /// How far the shadow is projected in the x and y directions
    offset: Vector,
    /// How far the shadow spreads
    spread: i32, /// default : 0
    /// Whether to show the shadow behind translucent or transparent pixels (applies only to drop shadows)
    show_shadow_behind_node: bool,
    /// A mapping of field to the VariableAlias of the bound variable.
    bound_variables: HashMap<String, VariableAlias>,
}

/// Enum describing the type of an effect
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub enum EffectType {
    InnerShadow,
    DropShadow,
    LayerBlur,
    BackgroundBlur,
}

/// A link to either a URL or another frame (node) in the document
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct HyperLink {
    /// Type of hyperlink
    /// URL
    /// NODE
    hyper_link_type: HyperLinkType,
    /// URL being linked to, if URL type
    url: String,
    /// ID of frame hyperlink points to, if NODE type
    node_id: String,
}

/// Enum describing the typed of an hyper link
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub enum HyperLinkType {
    Url,
    Node,
}

/// Represents a link to documentation for a component.
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub struct DocumentationLink {
    /// Should be a valid URI (e.g. https://www.figma.com).
    uri: String,
}

/// A solid color, gradient, or image texture that can be applied as fills or strokes
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/paint/")]
pub struct Paint {
    /// Type of paint as a string enum
    /// SOLID
    /// GRADIENT_LINEAR
    /// GRADIENT_RADIAL
    /// GRADIENT_ANGULAR
    /// GRADIENT_DIAMOND
    /// IMAGE
    /// EMOJI
    /// VIDEO
    paint_type: PaintType,
    /// Is the paint enabled?
    visible: bool, /// default : true
    /// Overall opacity of paint (colors within the paint can also have opacity values which would blend with this)
    opacity: f32, /// default : true

    /// For solid paints :
    
    /// Solid color of the paint
    color: Color,

    /// For gradient paints :

    /// How this node blends with nodes behind it in the scene (see blend mode section for more details)
    blend_mode: BlendMode,
    /// This field contains three vectors, each of which are a position in normalized object space (normalized object space is if the top left corner of the bounding box of the object is (0, 0) and the bottom right is (1,1)). The first position corresponds to the start of the gradient (value 0 for the purposes of calculating gradient stops), the second position is the end of the gradient (value 1), and the third handle position determines the width of the gradient. See image examples below :
    gradient_handle_positions: Vec<Vector>, // 3 vecs only
    /// Positions of key points along the gradient axis with the colors anchored there. Colors along the gradient are interpolated smoothly between neighboring gradient stops.
    gradient_stops: Vec<ColorStop>,

    /// For image paints :
    
    /// Image scaling mode
    /// FILL
    /// FIT
    /// TILE
    /// STRETCH
    scale_mode: PaintScaleMode,
    /// Affine transform applied to the image, only present if scaleMode is STRETCH
    image_transform: Transform,
    /// Amount image is scaled by in tiling, only present if scaleMode is TILE
    scaling_factor: i32,
    /// Image rotation, in degrees.
    rotation: i32,
    /// A reference to an image embedded in this node. To download the image using this reference, use the GET file images endpoint to retrieve the mapping from image references to image URLs
    image_ref: String,
    /// Defines what image filters have been applied to this paint, if any. If this property is not defined, no filters have been applied.
    filters: ImageFilters, /// default : {}
    /// A reference to the GIF embedded in this node, if the image is a GIF. To download the image using this reference, use the GET file images endpoint to retrieve the mapping from image references to image URLs
    gif_ref: String,
    /// A mapping of field to the VariableAlias of the bound variable.
    bound_variables: HashMap<String, VariableAlias>,
}

/// Enum describing the scale mode of a paint
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/paint/")]
pub enum PaintScaleMode {
    Fill,
    Fit,
    Tile,
    Stretch,
}

/// Enum describing the type of a paint
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/paint/")]
pub enum PaintType {
    Solid,
    GradientLienear,
    GradientRadial,
    GradientAngular,
    GradientDiamond,
    Image,
    Emoji,
    Video,
}

/// Defines a single path
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct Path {
    /// A series of path commands that encodes how to draw the path.
    path: String,
    /// The winding rule for the path (same as in SVGs). This determines whether a given point in space is inside or outside the path.
    winding_rule: String,
    /// If there is a per-region fill, this refers to an ID in the fillOverrideTable.
    override_id: i32,
}

/// A 2d vector
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub struct Vector {
    /// X coordinate of the vector
    x: i32,
    /// Y coordinate of the vector
    y: i32,
}

/// A width and a height
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub struct Size {
    /// the width of a size
    width: i32,
    /// the height of a size
    height: i32, 
}

/// A 2x3 affine transformation matrix
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub struct Transform {
    /// A 2D affine transformation matrix that can be used to calculate the affine transforms applied to a layer, including scaling, rotation, shearing, and translation.
    /// The form of the matrix is given as an array of 2 arrays of 3 numbers each. E.g. the identity matrix would be    [[1, 0, 0],
    matrix: Vec<Vec<i32>>, // 2 vecs containing each a vec of 3 i32 number
}

/// Defines the image filters applied to an image paint. All values are from -1 to 1.
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct ImageFilters {
    /// default: 0
    exposure_number: i32,
    /// default: 0
    contrast_number: i32,
    /// default: 0
    saturation_number: i32,
    /// default: 0
    temperature_number: i32,
    /// default: 0
    tint_number: i32,
    /// default: 0
    highlights_number: i32,
    /// default: 0
    shadows_number: i32,
}

/// A stop in a gradient paint that contains information about the stop position, color, and bound variables
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct ColorStop {
    /// Value between 0 and 1 representing position along gradient axis
    position: i32,
    /// Color attached to corresponding position
    color: Color,
    /// Color variable that is attached to the stop if any
    bound_variables: HashMap<String, VariableAlias>,
}

/// Paint metadata to override default paints
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/paint/")]
pub struct PaintOverride {
    /// Paints applied to characters
    fills: Vec<Paint>,
    /// ID of style node, if any, that this inherits fill data from
    inherit_fill_style_id: String,
}

/// Metadata for character formatting
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/typeStyle/")]
pub struct TypeStyle {
    /// Font family of text (standard name)
    font_family: String,
    /// PostScript font name
    font_post_script_name: String,
    /// Space between paragraphs in px, 0 if not present
    /// default: 0
    paragraph_spacing: i32, 
    /// Paragraph indentation in px, 0 if not present
    /// default: 0
    paragraph_indent: i32, 
    /// Space between list items in px, 0 if not present
    /// default: 0
    list_spacing: i32, 
    /// Whether or not text is italicized
    italic: bool,
    /// Numeric font weight
    font_weight: i32,
    /// Font size in px
    font_size: i32,
    /// Text casing applied to the node, default is the original casing
    /// UPPER
    /// LOWER
    /// TITLE
    /// SMALL_CAPS
    /// SMALL_CAPS_FORCED
    text_case: TypeStyleTextCase, /// default: ORIGINAL
    /// Text decoration applied to the node, default is none
    /// STRIKETHROUGH
    /// UNDERLINE
    text_decoration: TypeStyleTextDecoration, /// default: NONE
    /// Dimensions along which text will auto resize, default is that the text does not auto-resize. TRUNCATE means that the text will be shortened and trailing text will be replaced with "…" if the text contents is larger than the bounds. TRUNCATE as a return value is deprecated and will be removed in a future version. Read fromtextTruncation instead.
    /// HEIGHT
    /// WIDTH_AND_HEIGHT
    /// [DEPRECATED] TRUNCATE
    text_auto_resize: TypeStyleTextAutoResize, /// default: NONE
    /// Whether this text node will truncate with an ellipsis when the text contents is larger than the text node.
    /// DISABLED
    /// ENDING
    text_truncation: TypeStyleTextTruncation, /// default: DISABLED
    /// When textTruncation: "ENDING" is set, maxLinesdetermines how many lines a text node can grow to before it truncates
    max_lines: i32, /// default: null
    /// Horizontal text alignment as string enum
    /// LEFT
    /// RIGHT
    /// CENTER
    /// JUSTIFIED
    text_align_horizontal: TypeStyleTextAlignHorizontal,
    /// Vertical text alignment as string enum
    /// TOP
    /// CENTER
    /// BOTTOM
    text_align_vertical: TypeStyleTextAlignVertical,
    /// Space between characters in px
    letter_spacing: i32,
    /// Paints applied to characters
    fills: Vec<Paint>,
    /// Link to a URL or frame
    hyperlink: HyperLink,
    /// A map of OpenType feature flags to 1 or 0, 1 if it is enabled and 0 if it is disabled. Note that some flags aren't reflected here. For example, SMCP (small caps) is still represented by the textCase field.
    opentype_flags: HashMap<String, i32>, /// default: {}
    /// Line height in px
    line_height_px: i32,
    /// Line height as a percentage of normal line height. This is deprecated; in a future version of the API only lineHeightPx and lineHeightPercentFontSize will be returned.
    line_height_percent: i32, /// default: 100
    /// Line height as a percentage of the font size. Only returned when lineHeightPercent is not 100.
    line_height_percent_font_size: i32,
    /// The unit of the line height value specified by the user.
    /// PIXELS
    /// FONT_SIZE_%
    /// INTRINSIC_%
    line_height_unit: TypeStyleLineHeightUnit,
    /// Whether or not there are overrides over a text style. The possible fields to override are semanticWeight, semanticItalic, hyperlink, and textDecoration. If this is true, then those fields are overrides if present.
    is_override_over_text_style: bool,
    /// Indicates how the font weight was overridden when there is a text style override.
    /// BOLD
    /// NORMAL
    semantic_weight: TypeStyleSemanticWeight,
    /// Indicates how the font style was overridden when there is a text style override.
    /// ITALIC
    /// NORMAL
    semantic_italic: TypeStyleSemanticItalic,
}

/// Enum describing the text vertical align of TypeStyle
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/typeStyle/")]
pub enum TypeStyleTextAlignVertical {
    Top,
    Center,
    Bottom,
}

/// Enum describing the text horizontal align of TypeStyle
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/typeStyle/")]
pub enum TypeStyleTextAlignHorizontal {
    Left,
    Right,
    Center,
    Justified,
}

/// Enum describing the text truncation of TypeStyle
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/typeStyle/")]
pub enum TypeStyleTextTruncation {
    Disabled,
    Ending,
}

/// Enum describing the text auto resize of TypeStyle
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/typeStyle/")]
pub enum TypeStyleTextAutoResize {
    Height,
    WdithAndHeight,
    /// [DEPRECATED]
    Truncate, 
}

/// Enum describing the text decoration of TypeStyle
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/typeStyle/")]
pub enum TypeStyleTextDecoration {
    StrikeThrought,
    Underline,
}

/// Enum describing the line heignt unit of TypeStyle
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/typeStyle/")]
pub enum TypeStyleLineHeightUnit {
    Pixels,
    FontSize,
    Intrinsic,
}

/// Enum describing the semantic weight of TypeStyle
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/typeStyle/")]
pub enum TypeStyleSemanticWeight {
    Bold,
    Normal,
}

/// Enum describing the semantic italic of TypeStyle
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/typeStyle/")]
pub enum TypeStyleSemanticItalic {
    Italic,
    Normal,
}

/// Enum describing the text case of TypeStyle
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/typeStyle/")]
pub enum TypeStyleTextCase {
    Upper,
    Lower,
    Title,
    SmallCaps,
    SmallCapsForced,
}

/// A description of a main component. Helps you identify which component instances are attached to
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/component/")]
pub struct Component {
    /// The key of the component
    key: String,
    /// The name of the component
    name: String,
    /// The description of the component as entered in the editor
    description: String,
    /// The ID of the component set if the component belongs to one
    component_set_id: String,
    /// The documentation links for this component.
    documentation_links: Vec<DocumentationLink>,
    /// Whether this component is a remote component that doesn't live in this file
    remote: bool,
}

/// A description of a component set, which is a node containing a set of variants of a component
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/component/")]
pub struct ComponentSet {
    /// The key of the component set
    key: String,
    /// The name of the component set
    name: String,
    /// The description of the component set as entered in the editor
    description: String,
    /// The documentation links for this component set.
    documentation_links: Vec<DocumentationLink>,
    /// Whether this component set is a remote component set that doesn't live in this file
    remote: bool,
}

/// A set of properties that can be applied to nodes and published. Styles for a property can be created in the corresponding property's panel while editing a file
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct Style {
    /// The key of the style
    key: String,
    /// The name of the style
    name: String,
    /// The description of the style
    description: String,
    /// Whether this style is a remote style that doesn't live in this file
    remote: bool,
    /// The type of style as string enum
    /// FILL
    /// TEXT
    /// EFFECT
    /// GRID
    style_type: StyleType,
}

/// Enum describing the type of style
#[derive(Debug, Serialize, Deserialize, TS, Hash, PartialEq, Eq)]
#[ts(export, export_to = "properties/")]
pub enum StyleType {
    Fill,
    Text,
    Effect,
    Grid,
}

/// Geometric shape type. Most shape types have the same name as their tooltip but there are a few exceptions. ENG_DATABASE: Cylinder, ENG_QUEUE: Horizontal cylinder, ENG_FILE: File, ENG_FOLDER: Folder.
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub enum ShapeType {
    Square,
    Ellipse,
    RoundedRectangle,
    Diamond,
    TriangleDown,
    ParallelogramRight,
    ParallelogramLeft,
    EngDatabase,
    EngQueue,
    EngFile,
    EngFolder,
    Trapezoid,
    PredefinedProcess,
    Shield,
    DocumentSingle,
    DocumentMultiple,
    ManualInput,
    Hexagon,
    Chevron,
    Pentagon,
    Octagon,
    Star,
    Plus,
    ArrowLeft,
    ArrowRight,
    SummingJunction,
    Or,
    SpeechBubble,
    InternalStorage,
}

/// Stores canvas location for a connector start/end point.
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct ConnectorEndpoint {
    /// ConnectorEndpoint with endpointNodeId and position only:
    
    /// Node ID this endpoint attaches to.
    endpoint_node_id: String,
    /// Canvas location as x & y coordinate.
    /// ConnectorEndpoint with endpointNodeId and magnet only:
    position: Vector,
    /// The magnet type is a string enum
    /// AUTO
    /// TOP
    /// BOTTOM
    /// LEFT
    /// RIGHT
    magnet: ConnectorMagnet,
}

/// Enum describing magnet type
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub enum ConnectorMagnet {
    Auto,
    Top,
    Bottom,
    Left,
    Right,
}

/// Connector line type
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub enum ConnectorLineType {
    Elbowed,
    Straight,
}

/// Connector text background.
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct ConnectorTextBackground {
    /// Radius of each corner of the rectangle if a single radius is set for all corners
    corner_radius: f32,
    /// An array of fill paints applied to the node
    fills: Vec<Paint>,
}


/// Component property definition
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/component/")]
pub struct ComponentPropertyDefinition {
    /// Type of this component property
    component_type: ComponentPropertyType,
    /// Initial value of this property for instances
    default_value: ComponentPropertyDefinitionDefaultValue, // enum boolString, traits, generics ?
    /// All possible values for this property. Only exists on VARIANT properties
    variant_options: Vec<String>,
    /// List of user-defined preferred values for this property. Only exists on INSTANCE_SWAP properties
    preferred_values: Vec<InstanceSwapPreferredValue>
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/component/")]
pub enum ComponentPropertyDefinitionDefaultValue {
    Bool(bool),
    String(String),
}

/// Component property
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/component/")]
pub struct ComponentProperty {
    /// Type of this component property
    component_property_type: ComponentPropertyType,
    /// Value of this property set on this instance
    value: ComponentPropertyValue, 
    /// List of user-defined preferred values for this property. Only exists on INSTANCE_SWAP properties
    preferred_values: Vec<InstanceSwapPreferredValue>,
    /// A mapping of field to the VariableAlias of the bound variable.
    bound_variables: HashMap<String, VariableAlias>,
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/component/")]
pub enum ComponentPropertyValue {
    Bool(bool),
    String(String),
}

/// Component property type
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/component/")]
pub enum ComponentPropertyType {
    Boolean,
    InstanceSwap,
    Text,
    Variant,
}

/// Instance swap preferred value
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub struct InstanceSwapPreferredValue {
    /// Type of node for this preferred value
    istance_swap_preferred_value_type: InstanceSwapPreferredValueType,
    /// Key of this component or component set
    key: String,
}

/// Enum describing InstanceSwapPreferredValueType
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub enum InstanceSwapPreferredValueType {
    Component,
    ComponentSet,
}

/// The device used to view a prototype
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct PrototypeDevice {
    prototype_device_type: PrototypeDeviceType,
    size: Size,
    /// rotation'NONE' | 'CCW_90'
    preset_identifier: String,
    rotation: PrototypeDeviceRotation,
}

/// Enum desccribin PrototypeDeviceRotation
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub enum PrototypeDeviceRotation {
    None,
    CCW90,
}

/// Enum describing PrototypeDeviceType
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub enum PrototypeDeviceType {
    None,
    Preset,
    Custom,
    Presentation,
}

/// A note and pinned properties left on a node in Dev Mode
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub struct Annotation {
    label: String,
    properties: Vec<AnnotationProperty>,
}

/// A pinned property in an Annotation
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub struct AnnotationProperty {
    annotation_property_type: AnnotationPropertyType,
}

/// Enum describing AnnotationPropertyType
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub enum AnnotationPropertyType {
    Width,
    Height,
    Maxwidth,
    Minwidth,
    Maxheight,
    Minheight,
    Fills,
    Strokes,
    Effects,
    Strokeweight,
    Cornerradius,
    Textstyleid,
    Textalignhorizontal,
    Fontfamily,
    Fontstyle,
    Fontsize,
    Fontweight,
    Lineheight,
    Letterspacing,
    Itemspacing,
    Padding,
    Layoutmode,
    Alignitems,
    Opacity,
    Maincomponent,
}

/// A pinned distance between two nodes in Dev Mode
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/measurement/")]
pub struct Measurement {
    id: String,
    start: MeasurementStartEnd,
    end: MeasurementStartEnd,
    offset: MeasurementOffset,
    /// When manually overridden, the displayed value of the measurement
    free_text: String,
}

/// Enum describing the offest of a Measurement
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/measurement/")]
pub enum MeasurementOffset {
    MeasurementOffsetInner(MeasurementOffsetInner),
    MeasurementOffsetOuter(MeasurementOffsetOuter),
}

/// The node and side a measurement is pinned to
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/measurement/")]
pub struct MeasurementStartEnd {
    node_id: String,
    side: MeasurementStartEndSide,
}

/// Enum describing MeasurementStartEndSide
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/measurement/")]
pub enum MeasurementStartEndSide {
    Top,
    Right,
    Bottom,
    Left,
}

/// Measurement offset relative to the inside of the start node
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/measurement/")]
pub struct MeasurementOffsetInner {
    measurement_offset_inner_type: String, // always 'INNER'
    relative: i32,
}

/// Measurement offset relative to the outside of the start nod
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/measurement/")]
pub struct MeasurementOffsetOuter {
    measurement_offset_outer_type: String, // always 'OUTER'
    relative: i32,
}

/// Individual stroke weights
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/stroke/")]
pub struct StrokeWeights {
    /// The top stroke weight
    top: i32,
    /// The right stroke weight
    right: i32,
    /// The bottom stroke weight
    bottom: i32,
    /// The left stroke weight
    left: i32,
}

/// Position of stroke relative to vector outline, as a string enum
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/stroke/")]
pub enum StrokeAlign {
    /// Stroke drawn inside the shape boundary
    Inside,
    /// Stroke drawn outside the shape boundary
    Outside,
    /// Stroke drawn centered along the shape boundary
    Center
}

/// A string enum with values describing the end caps of vector paths.
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/stroke/")]
pub enum StrokeCap {
    None,
    Round,
    Square,
    LineArrow,
    TriangleArrow,
    DiamondFilled,
    CircleFilled,
    TriangleFilled,
    WashiTape1,
    WashiTape2,
    WashiTape3,
    WashiTape4,
    WashiTape5,
    WashiTape6,
}

/// A string enum describing how corners in vector paths are rendered.
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/stroke/")]
pub enum StrokeJoin {
    Mitter,
    Bevel,
    Round,
}

/// Fields directly overridden on an instance. Inherited overrides are not included.
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct Overrides {
    /// A unique ID for a node
    id: String,
    /// An array of properties
    overridden_fields: Vec<String>,
}

/// Contains a variable alias.
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct VariableAlias {
    variable_alias_type: String, // always 'VARIABLE_ALIAS'
    /// The id of the variable that the current variable is aliased to. This variable can be a local or remote variable, and both can be retrieved via the GET /v1/files/:file_key/variables/local endpoint.
    id: String,
}

/// Represents a handoff (or dev) status applied to a node.
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct DevStatus {
    dev_status_type: DevStatusType,
    /// An optional field where the designer can add more information about the design and what has changed.
    description: String,
}

/// Enum describing the type of DevStatus
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub enum DevStatusType {
    ReadyForDev,
    Completed,
}

/// An interaction in the Figma viewer, containing a trigger and one or more actions.
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/interaction/")]
pub struct Interaction {
    /// The user event that initiates the interaction.
    trigger: Option<Trigger>,
    /// The actions that are performed when the trigger is activated.
    actions: Vec<Action>,
}

/// A prototyping Trigger describes the user input needed to cause an interaction to happen.
/// The "ON_HOVER" and "ON_PRESS" trigger types revert the navigation when the trigger is finished (the result is temporary).
/// "MOUSE_ENTER", "MOUSE_LEAVE", "MOUSE_UP" and "MOUSE_DOWN" are permanent, one-way navigation. The delay parameter requires the trigger to be held for a certain duration of time before the action occurs. Both timeout and delay values are in milliseconds.
/// The "ON_MEDIA_HIT" and "ON_MEDIA_END" trigger types can only trigger from a video. They fire when a video reaches a certain time or ends. The timestamp value is in seconds.'
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/interaction/")]
pub struct Trigger {
    trigger_type: TriggerType,
    
    /// For "AFTER_TIMEOUT" events:
    
    timeout: i32,
    
    /// For "MOUSE_ENTER", "MOUSE_LEAVE", "MOUSE_UP", and "MOUSE_DOWN" events:
    
    delay: i32,
    /// Whether this is a deprecated version of the trigger that was left unchanged for backwards compatibility. If not present, the trigger is the latest version.
    deprecated_version: bool,

    /// For "ON_KEY_DOWN" events:

    device: TriggerDevice,
    key_codes: Vec<i32>,

    /// For "ON_MEDIA_HIT" events:

    media_hit_time: i32,
}

/// Enum describing the device of a trigger
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/interaction/")]
pub enum TriggerDevice {
    Keyboard,
    XboxOne,
    Ps4,
    SwitchPro,
    UnknownController,
}

/// Enum describing the type of a trigger,
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/interaction/")]
pub enum TriggerType {
    OnClick,
    OnHover,
    OnPress,
    OnDrag,
    AfterTimeout,
    MouseEnter,
    MouseLeave,
    MouseUp,
    MouseDown,
    OnMediaEnd,
    OnKeyDown,
    OnKeyUp,
    OnMediaHit,
}

/// An action that is performed when a trigger is activated.
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/interaction/")]
pub enum Action {
    /// An action can be one of the following types:
    BackAction,
    CloseAction,
    OpenURLAction(OpenURLAction),
    UpdateMediaRuntimeAction(UpdateMediaRuntimeAction),
    SetVariableAction(SetVariableAction),
    SetVariableModeAction(SetVariableModeAction),
    ConditionalAction(ConditionalAction),
    NodeAction(NodeAction),
}

/// An action that opens a URL.
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/interaction/")]
pub struct OpenURLAction {
    open_url_action_type: String, // always 'URL'
    url: String,
}

/// An action that affects a video node in the Figma viewer. For example, to play, pause, or skip.
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/interaction/")]
pub struct UpdateMediaRuntimeAction {
    update_media_runtime_type: String, // always 'UPDATE_MEDIA_RUNTIME'
    /// The node ID of the media node to update. If destinationId is null, the action will update the media node that contains the action.
    destination_id: Option<String>,
    /// The action to perform on the media node.
    media_action: UpdateMediaRuntimeActionMediaAction,
    
    /// For "SKIP_FORWARD" and "SKIP_BACKWARDS" actions:
    
    /// The amount of time to skip in seconds.
    amount_to_skip: i32,
    
    /// For SKIP_TO actions:
    
    /// The new time to skip to in seconds.
    new_timestamp: i32,
}

/// Enum describing the media action of UpdateMediaRuntimeAction
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/interaction/")]
pub enum UpdateMediaRuntimeActionMediaAction {
    Play,
    Pause,
    TogglePlayPause,
    Mute,
    Unmute,
    ToggleMuteUnmute,
    SkipForward,
    SkipBackward,
    SkipTo,
}

/// An action that navigates to a specific node in the Figma viewer.
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/interaction/")]
pub struct NodeAction {
    node_action_type: String, // alwasy 'NODE'
    destination_id: Option<String>,
    navigation: Navigation,
    transition: NodeActionTransition,
    /// Whether the scroll offsets of any scrollable elements in the current screen or overlay are preserved when navigating to the destination. This is applicable only if the layout of both the current frame and its destination are the same.
    preserve_scroll_position: bool,
    /// Applicable only when navigation is "OVERLAY" and the destination is a frame with overlayPosition equal to "MANUAL". This value represents the offset by which the overlay is opened relative to this node.
    overlay_relative_position: Vector,
    /// When true, all videos within the destination frame will reset their memorized playback position to 00:00 before starting to play.
    reset_video_position: bool,
    /// Whether the scroll offsets of any scrollable elements in the current screen or overlay reset when navigating to the destination. This is applicable only if the layout of both the current frame and its destination are the same.
    reset_scroll_position: bool,
    /// Whether the state of any interactive components in the current screen or overlay reset when navigating to the destination. This is applicable if there are interactive components in the destination frame.
    reset_interactive_components: bool,
}

/// Enum describing the transition of a node action
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/transition/")]
pub enum NodeActionTransition {
    SimpleTransition(SimpleTransition),
    DirectionalTransition(DirectionalTransition),
    Null,
}

/// The method of navigation. The possible values are:
///- "NAVIGATE": Replaces the current screen with the destination, also closing all overlays.
///- "OVERLAY": Opens the destination as an overlay on the current screen.
///- "SWAP": On an overlay, replaces the current (topmost) overlay with the destination. On a top-level frame, behaves the same as "NAVIGATE" except that no entry is added to the navigation history.
///- "SCROLL_TO": Scrolls to the destination on the current screen.
///- "CHANGE_TO": Changes the closest ancestor instance of source node to the specified variant.'
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct Navigation {
    navigation_type: NavigationType,
}

/// Enum describing the type of an animation
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub enum NavigationType {
    Navigate,
    Swap,
    Overlay,
    ScrollTo,
    ChangeTo,
}

/// Describes an animation used when navigating in a prototype.
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/transition/")]
pub struct SimpleTransition {
    simple_transition_type: SimpleTransitionType,
    /// The duration of the transition in milliseconds.
    duration: i32,
    /// The easing curve of the transition.
    easing: Easing,
}

/// Enum describing the type of a simple transition
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/transition/")]
pub enum SimpleTransitionType {
    Dissolve,
    SmartAnimate,
    ScrollAnimate,
}

/// Describes an animation used when navigating in a prototype.
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/transition/")]
pub struct DirectionalTransition {
    directional_transition_type: DirectionalTransitionType,
    direction: DirectionalTransitionDirection,
    /// The duration of the transition in milliseconds.
    duration: i32,
    /// The easing curve of the transition.
    easing: Easing,
    /// When the transition type is "SMART_ANIMATE" or when matchLayers is true, then the transition will be performed using smart animate, which attempts to match corresponding layers and interpolate other properties during the animation.
    match_layers: bool,
}

/// Enum describing the type of a DirectionalTransition
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/transition/")]
pub enum DirectionalTransitionType {
    MoveIn,
    MoveOut,
    Push,
    SlideIn,
    SlideOut,
}

/// Enum describing the directions of DirectionalTransition
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/transition/")]
pub enum DirectionalTransitionDirection {
    Left,
    Right,
    Top,
    Bottom,
}

/// Describes an easing curve.
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/easing/")]
pub struct Easing {
    /// The type of easing curve.
    easing_type: EasingType,
    /// A cubic bezier curve that defines the easing.
    easing_function_cubic_bezier: EasingFunctionCubicBezier,
    /// A spring function that defines the easing.
    easing_function_spring: EasingFunctionSpring,
}

/// A cubic bezier curve that defines the easing.
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/easing/")]
pub struct EasingFunctionCubicBezier {
    /// The x component of the first control point.
    x1: i32,
    /// The y component of the first control point.
    y1: i32,
    /// The x component of the second control point.
    x2: i32,
    /// The y component of the second control point.
    y2: i32,
}

/// A spring function that defines the easing.
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/easing/")]
pub struct EasingFunctionSpring {
    mass: i32,
    stiffness: i32,
    damping: i32,
}

/// An action that sets a variable to a specific value.
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct SetVariableAction {
    set_variable_action_type: String, // always 'SET_VARIABLE'
    variable_id: Option<String>,
    variable_value: VariableData,
}

/// An action that sets a variable to a specific mode.
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct SetVariableModeAction {
    set_variable_mode_action_type: String, // always 'SET_VARIABLE_MODE'
    variable_collection_id: Option<String>,
    variable_mode_id: Option<String>,
}

/// An action that checks if a condition is met before performing certain actions by using an if/else conditional statement.
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct ConditionalAction {
    conditional_action_type: String, // always 'CONDITIONAL'
    conditional_blocks: Vec<ConditionalBlock>,
}

/// A value to set a variable to during prototyping.
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct VariableData {
    variable_data_type: VariableDataType,
    resolved_type: VariableResolvedDataType,
    value: VariableDataValue,
}

/// Enum decribing the value of a variable data
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub enum VariableDataValue {
    Bool(bool),
    I32(i32),
    String(String),
    Color(Color),
    RGBColor(RGBColor),
    VariableAlias(VariableAlias),
    Expression(Expression),
}

/// Defines the types of data a VariableData object can hold.
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub enum VariableDataType {
    Boolean,
    Float,
    String,
    Color,
    VariableAlias,
    Expression,
}

/// Defines the types of data a VariableData object can eventually equal.
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub enum VariableResolvedDataType {
    Boolean,
    Float,
    String,
    Color,
}

/// Defines the Expression object, which contains a list of VariableData objects strung together by operators (VariableData).
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct Expression {
    expression_function: ExpressionFunction,
    expression_arguments: Vec<VariableData>,
}

/// Defines the list of operators available to use in an Expression.
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "properties/")]
pub enum ExpressionFunction {
    Addition,
    Subtraction,
    Multiplication,
    Division,
    Equals,
    Not,
    LessThan,
    LessThanOrEqual,
    GreaterThan,
    GreaterThanOrEqual,
    And,
    Or,
    VarModeLookup,
    Negate,
}

/// Either the if or else conditional blocks. The if block contains a condition to check. If that condition is met then it will run those list of actions, else it will run the actions in the else block.
#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "properties/")]
pub struct ConditionalBlock {
    condition: VariableData,
    actions: Vec<Action>,
}
