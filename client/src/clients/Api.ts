import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Err, Ok, Result } from "ts-results";

class Api {
  private apiInstance: AxiosInstance;
  private readonly overrideApiError?: (apiError: ApiError) => ApiError;

  constructor(
    baseUrl: string,
    overrideApiError?: (apiError: ApiError) => ApiError
  ) {
    this.apiInstance = axios.create({
      baseURL: baseUrl,
    });
    this.overrideApiError = overrideApiError;
  }

  private createRequestConfig = (
    customHeaders?: Record<string, string>
  ): AxiosRequestConfig => ({
    headers: {
      "Content-Type": "application/json",
      ...customHeaders,
    },
  });

  private toApiError = (
    error: any,
    overrideApiError?: (apiError: ApiError) => ApiError
  ): ApiError => {
    // no response = errors not originated from our code, for example URL incorrect, cannot connect
    if (!error.response) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    // specific error response from our services
    let apiMessage: string = error.message;
    if (!error.message && error.response.status) {
      apiMessage = error.response.status;
    } else if (!error.message) {
      apiMessage = error.stack;
    }

    let apiError: ApiError = {
      name: error.name,
      message: apiMessage,
      stack: error.stack,
      statusCode: error.response.status,
      responseBody: error.response.data ?? error.response,
    };

    // special handling of error.response for specific services
    if (overrideApiError) {
      apiError = overrideApiError(apiError);
    }

    return apiError;
  };

  async get<TResponse>(
    endpoint: string,
    customHeaders?: Record<string, string>
  ): Promise<Result<TResponse, ApiError>> {
    try {
      const result = await this.apiInstance.get<TResponse>(
        endpoint,
        this.createRequestConfig(customHeaders)
      );
      return Ok(result.data);
    } catch (error: any) {
      return Err(this.toApiError(error, this.overrideApiError));
    }
  }

  async post<TRequest, TResponse>(
    endpoint: string,
    body: TRequest,
    customHeaders?: Record<string, string>
  ): Promise<Result<TResponse, ApiError>> {
    try {
      const result = await this.apiInstance.post<TRequest, any>(
        endpoint,
        body,
        this.createRequestConfig(customHeaders)
      );
      return Ok(result.data);
    } catch (error: any) {
      return Err(this.toApiError(error, this.overrideApiError));
    }
  }

  async put<TRequest, TResponse>(
    endpoint: string,
    body: TRequest,
    customHeaders?: Record<string, string>
  ): Promise<Result<TResponse, ApiError>> {
    try {
      const result = await this.apiInstance.put<TRequest, any>(
        endpoint,
        body,
        this.createRequestConfig(customHeaders)
      );
      return Ok(result.data);
    } catch (error: any) {
      return Err(this.toApiError(error, this.overrideApiError));
    }
  }

  async delete<TRequest, TResponse>(
    endpoint: string,
    customHeaders?: Record<string, string>
  ): Promise<Result<TResponse, ApiError>> {
    try {
      const result = await this.apiInstance.delete<TRequest, any>(
        endpoint,
        this.createRequestConfig(customHeaders)
      );
      return Ok(result.data);
    } catch (error: any) {
      return Err(this.toApiError(error, this.overrideApiError));
    }
  }
}

export interface ApiError extends Error {
  statusCode?: number;
  responseBody?: any;
}

export default Api;
