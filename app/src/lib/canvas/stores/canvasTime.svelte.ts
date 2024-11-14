import type { TimerMode } from "$lib/canvas/types/TimerMode";

type CanvasTimeStates = {
  timestamp: number;
  timers: Timer[];
};

class CanvasTimeSvelte {
  private states: CanvasTimeStates = $state({
    timestamp: 0,
    timers: [],
  });

  constructor() {}

  get timestamp(): number {
    return this.states.timestamp;
  }

  get timers(): Timer[] {
    return this.states.timers;
  }

  addTimer(timer: Timer) {
    this.states.timers.push(timer);
  }

  updateTimestamp(t: number) {
    this.states.timestamp = t;
  }

  updateTimers() {
    for (const timer of this.timers) {
      timer.tick(this.timestamp);
    }
  }
}

type TimerStates = {
  start: number | null;
  elapsed: number;
  cooldown: number;
  mode: TimerMode;
};

export class Timer {
  private states: TimerStates = $state({
    start: null,
    elapsed: 0,
    cooldown: 100,
    mode: "Once",
  });

  constructor(cooldown: number, mode: TimerMode) {
    this.states.cooldown = cooldown;
    this.states.mode = mode;

    canvasTime.addTimer(this);
  }

  tick(timestamp: number) {
    if (this.states.start === null) {
      this.states.start = timestamp;
    }

    this.states.elapsed = timestamp - this.states.start;

    if (this.states.mode === "Repeating") {
      if (this.states.elapsed >= this.states.cooldown) {
        this.reset();
      }
    }
  }

  finished(): boolean {
    return this.states.elapsed >= this.states.cooldown;
  }

  reset() {
    this.states.start = null;
  }
}

export const canvasTime = new CanvasTimeSvelte();
