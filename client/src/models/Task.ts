export type TaskDetails = {
  name: string;
  priority: number;
  status: string;
};

export const SUPPORTED_STATUSES = ["NotStarted", "InProgress", "Completed"];
