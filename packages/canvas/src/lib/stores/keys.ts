import { get, writable, type Writable } from "svelte/store";
import type { KeyboardKey } from "@fig/types/KeyboardKey";

type KeysStore = {
  currentKey: KeyboardKey | null;
};

class Keys {
  store: Writable<KeysStore>;

  constructor() {
    this.store = writable({
      currentKey: null,
    });

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", this.handleKeyDown.bind(this));
    }
  }

  handleKeyDown(e: KeyboardEvent) {
    // console.log("Key", e.key, "is pressed");
    this.store.update((store) => {
      store.currentKey = e.key;
      return store;
    });
  }

  get currentKey(): KeyboardKey {
    return get(this.store).currentKey;
  }

  destroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", this.handleKeyDown.bind(this));
    }
  }
}

export const keys = new Keys();
