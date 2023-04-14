import { Result } from "ts-results";
import config from "../config";
import { TaskDetails } from "../models";
import Api, { ApiError } from "./Api";

const overrideApiError = (apiError: ApiError): ApiError => {
  let apiMessage: string = apiError.message;
  if (apiError.responseBody && apiError.responseBody.title) {
    apiMessage = apiError.responseBody.title;
  }

  if (apiError.responseBody && apiError.responseBody.errors) {
    apiMessage = `${apiMessage}\n${JSON.stringify(
      apiError.responseBody.errors,
      null,
      2
    )}`;
  }

  return {
    name: apiError.name,
    message: apiMessage,
    stack: apiError.stack,
    statusCode: apiError.statusCode,
    responseBody: apiError.responseBody,
  };
};

const api = new Api(config.todoistUrl, overrideApiError);

export const loadTaskList = async (): Promise<
  Result<TaskDetails[], ApiError>
> => await api.get<TaskDetails[]>(`v1/tasks`);

export const createTask = async (
  taskDetails: TaskDetails
): Promise<Result<null, ApiError>> =>
  await api.post<TaskDetails, null>(`v1/task/${taskDetails.name}`, taskDetails);

export const deleteTask = async (
  taskName: string
): Promise<Result<null, ApiError>> =>
  await api.delete<TaskDetails, null>(`v1/task/${taskName}`);
