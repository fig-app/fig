import { get, writable, type Writable } from "svelte/store";
import type { KeyboardKey } from "@fig/types/KeyboardKey";

type KeysStore = {
  currentKey: KeyboardKey | null;
  combo: KeyboardKey[];
};

class Keys {
  store: Writable<KeysStore>;

  constructor() {
    this.store = writable({
      currentKey: null,
      combo: [],
    });

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", this.handleKeyDown.bind(this));
      window.addEventListener("keyup", this.handleKeyUp.bind(this));
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    let key = e.key;
    // console.log("Key", e.key, "is pressed");
    this.store.update((store) => {
      store.currentKey = key;
      if (!store.combo.includes(key)) {
        store.combo = [...store.combo, key];
      }
      return store;
    });
  }

  private handleKeyUp(e: KeyboardEvent) {
    let isCommand = e.ctrlKey || e.altKey || e.shiftKey || e.metaKey;

    this.store.update((store) => {
      store.currentKey = null;

      if (!isCommand) {
        store.combo = [];
      } else {
        if (this.containCommandsKey()) {
          store.combo = store.combo.slice(0, 1);
        }
      }

      return store;
    });
  }

  get currentKey(): KeyboardKey | null {
    return get(this.store).currentKey;
  }

  get combo(): KeyboardKey[] {
    return get(this.store).combo;
  }

  isPressed(key: KeyboardKey): boolean {
    return this.currentKey === key;
  }

  containCommandsKey(): boolean {
    let commands: KeyboardKey[] = ["Control", "Alt", "Shift", "Meta"];
    for (const key of commands) {
      if (this.combo.includes(key)) {
        return true;
      }
    }
    return false;
  }

  destroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", this.handleKeyDown.bind(this));
      window.removeEventListener("keyup", this.handleKeyUp.bind(this));
    }
  }
}

export const keys = new Keys();
