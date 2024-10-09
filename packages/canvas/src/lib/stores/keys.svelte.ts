import type { KeyboardKey } from "@fig/types/KeyboardKey.ts";

type KeysStore = {
  currentKey: KeyboardKey | null;
  combo: KeyboardKey[];
};

class Keys {
  private states: KeysStore = $state({
    currentKey: null,
    combo: [],
  });

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", this.handleKeyDown.bind(this));
      window.addEventListener("keyup", this.handleKeyUp.bind(this));
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    e.preventDefault();

    let key = e.key;
    this.states.currentKey = key;
    if (!this.states.combo.includes(key)) {
      this.states.combo = [...this.states.combo, key];
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    e.preventDefault();

    let isCommand = e.ctrlKey || e.altKey || e.shiftKey || e.metaKey;

    this.states.currentKey = null;

    if (!isCommand) {
      this.states.combo = [];
    } else {
      if (this.containCommandsKey()) {
        this.states.combo = this.states.combo.slice(0, 1);
      }
    }
  }

  get currentKey(): KeyboardKey | null {
    return this.states.currentKey;
  }

  get combo(): KeyboardKey[] {
    return this.states.combo;
  }

  isPressed(key: KeyboardKey): boolean {
    return this.currentKey === key;
  }

  checkCombo(keys: KeyboardKey[]): boolean {
    return this.combo === keys;
  }

  containKey(key: KeyboardKey): boolean {
    return this.combo.includes(key);
  }

  containCommandsKey(): boolean {
    let commands: KeyboardKey[] = ["Control", "Alt", "Shift", "Meta"];
    for (const key of commands) {
      if (this.containKey(key)) {
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
