
export interface SelectedTaskData {
  __typename: string;
  selectedTaskId: string;
  focusTime: number;
  selectedTaskName: string;
}

export interface GetLocalDataQuery {
  selectedTaskData: SelectedTaskData;
}

export interface GetFocusTimeQuery {
  seconds: number;
}