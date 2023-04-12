export type TaskDetails = {
  name: string;
  priority: number;
  status: string;
};

export const SUPPORTED_STATUSES = ["Not started", "In progress", "Completed"];
