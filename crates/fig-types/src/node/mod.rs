#![allow(dead_code)]

use serde::{Deserialize, Serialize};
use ts_rs::TS;
use vector::{EmptyData, RectangleData, VectorNode};

use crate::properties::Color;

pub mod vector;

#[derive(Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "nodes/")]
pub struct Node {
    /// A string uniquely identifying this node within the document.
    id: String,
    /// The name given to the node by the user in the tool.
    name: String,
    /// Whether or not the node is visible on the canvas.
    visible: bool,
    /// The type of the node.
    node: NodeType,
    /// The rotation of the node, if not 0.
    rotation: i32,
}

#[derive(Serialize, Deserialize, TS)]
#[serde(rename_all = "lowercase")]
#[serde(tag = "type", content = "data")]
// #[ts(export, export_to = "nodes/")]
pub enum NodeType {
    Document(DocumentNode),
    Canvas(CanvasNode),
    Vector(VectorNode<EmptyData>),
    Rectangle(VectorNode<RectangleData>),
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "nodes/")]
pub struct DocumentNode {
    /// An array of canvases attached to the document.
    children: Vec<Node>,
}

#[derive(Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "nodes/")]
pub struct CanvasNode {
    /// An array of top level layers on the canvas
    children: Vec<Node>,
    //// Background color of the canvas.
    background_color: Color,
    //// An array of export settings representing images to export from the canvas
    // export_settings: Vec<ExportSetting>
}
