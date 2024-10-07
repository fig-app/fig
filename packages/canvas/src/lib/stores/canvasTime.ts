import { get, writable, type Writable } from "svelte/store";
import type { TimerMode } from "$lib/types/TimerMode";

type CanvasTimeStore = {
  timestamp: number;
  timers: Timer[];
};

class CanvasTime {
  private store: Writable<CanvasTimeStore>;

  constructor() {
    this.store = writable({
      timestamp: 0,
      timers: [],
    });
  }

  get timestamp(): number {
    return get(this.store).timestamp;
  }

  get timers(): Timer[] {
    return get(this.store).timers;
  }

  addTimer(timer: Timer) {
    this.store.update((store) => {
      store.timers.push(timer);
      return store;
    });
  }

  updateTimestamp(t: number) {
    this.store.update((store) => {
      store.timestamp = t;
      return store;
    });
  }

  updateTimers() {
    for (const timer of this.timers) {
      timer.tick(this.timestamp);
    }
  }
}

export class Timer {
  start: number | null;
  elapsed: number;
  cooldown: number;
  mode: TimerMode;
  finishedBlocker: boolean;

  constructor(cooldown: number, mode: TimerMode) {
    this.start = null;
    this.elapsed = 0;
    this.cooldown = cooldown;
    this.mode = mode;

    this.finishedBlocker = false;

    canvasTime.addTimer(this);
  }

  tick(timestamp: number) {
    if (this.start === null) {
      this.start = timestamp;
    }

    this.elapsed = timestamp - this.start;

    if (this.mode === "Repeating") {
      if (this.elapsed >= this.cooldown) {
        this.reset();
      }
    }
  }

  finished(): boolean {
    let isFinished = this.elapsed >= this.cooldown && !this.finishedBlocker;
    if (isFinished) {
      this.finishedBlocker = true;
    }
    return isFinished;
  }

  reset() {
    this.start = null;
    this.finishedBlocker = false;
  }
}

export const canvasTime = new CanvasTime();
