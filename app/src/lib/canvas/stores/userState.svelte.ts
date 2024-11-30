class UserState {
  isEditing = $state(false);
  isDragging = $state(false);
  isResizingNode = $state(false);
}

export let userState = new UserState();
