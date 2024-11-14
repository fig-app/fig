type modeType = 'SELECTOR' | 'PEN';

type userModeStore = {
  mode: modeType,
};

class userModeClass {
  private states: userModeStore = $state({
    mode: 'SELECTOR',
  });

  constructor() {
  }

  get mode(): modeType {
    return this.states.mode;
  }

  set mode(mode: modeType) {
    this.states.mode = mode;
  }
}

export const userMode = new userModeClass();
