export type TaskDetails = {
  name: string;
  priority: number;
  status: TaskStatus;
};

export enum TaskStatus {
  NotStarted = "NotStarted",
  InProgress = "InProgress",
  Completed = "Completed",
}
