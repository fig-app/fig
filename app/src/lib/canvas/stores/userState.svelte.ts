type UserStateType = {
  isEditing: boolean,
  isDragging: boolean,
}

class UserState {
  private states: UserStateType = $state({
    isEditing: false,
    isDragging: false,
  });

  constructor() {
  }

  get isEditing(): boolean {
    return this.states.isEditing;
  }

  set isEditing(isEditing: boolean) {
    this.states.isEditing = isEditing;
  }

  get isDragging(): boolean {
    return this.states.isDragging;
  }

  set isDragging(isDragging: boolean) {
    this.states.isDragging = isDragging;
  }
}

export let userState = new UserState();
