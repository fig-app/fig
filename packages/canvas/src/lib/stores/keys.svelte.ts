import type {KeyboardKey} from "@fig/types/KeyboardKey";

class Keys {
  keyPressed: KeyboardKey[] = $state([]);

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", this.handleKeyDown.bind(this));
      window.addEventListener("keyup", this.handleKeyUp.bind(this));
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    e.preventDefault();

    let key = e.key;
    if (!this.keyPressed.includes(key)) {
      this.keyPressed = [...this.keyPressed, key];
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    e.preventDefault();
    let idx = this.keyPressed.indexOf(e.key);
    if (idx > -1) {
      this.keyPressed.splice(idx, 1);
    }
  }

  get anyPressed(): boolean {
    return this.keyPressed.length > 0;
  }

  get combo(): KeyboardKey[] {
    return this.keyPressed;
  }

  isPressed(key: KeyboardKey): boolean {
    return this.keyPressed.includes(key);
  }

  checkCombo(keys: KeyboardKey[]): boolean {
    return this.combo === keys;
  }

  containCommandsKey(): boolean {
    let commands: KeyboardKey[] = ["Control", "Alt", "Shift", "Meta"];
    for (const key of commands) {
      if (this.isPressed(key)) {
        return true;
      }
    }
    return false;
  }

  shiftPressed(): boolean {
    return this.isPressed("Shift");
  }

  ctrlPressed(): boolean {
    return this.isPressed("Control");
  }

  altPressed(): boolean {
    return this.isPressed("Alt");
  }

  destroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", this.handleKeyDown.bind(this));
      window.removeEventListener("keyup", this.handleKeyUp.bind(this));
    }
  }
}

export const keys = new Keys();
