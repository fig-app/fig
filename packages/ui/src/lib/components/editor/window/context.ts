import { getContext, setContext } from "svelte";

const WINDOW_TAG = Symbol("WINDOW");

export type WindowContext = {
  top: number;
  left: number;
  windowRef: HTMLElement | undefined;
  closeWindow: () => void;
};

export function setWindowContext(context: WindowContext) {
  setContext(WINDOW_TAG, context);
}

export function getWindowContext(): WindowContext {
  return getContext<WindowContext>(WINDOW_TAG);
}
