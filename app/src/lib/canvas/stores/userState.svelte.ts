type UserStateType = {
  isEditing: boolean,
}

class UserState {
  private states: UserStateType = $state({
    isEditing: false,
  });

  constructor() {
  }

  get isEditing(): boolean {
    return this.states.isEditing;
  }

  set isEditing(isEditing: boolean) {
    this.states.isEditing = isEditing;
  }
}

export let userState = new UserState();
