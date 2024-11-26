type ModeType = "SELECTOR" | "PEN";

class CanvasSettings {
  mode: ModeType = $state("SELECTOR");
  backgroundColor: string = $state("#1E1E1E");
}

export const canvasSettings = new CanvasSettings();
