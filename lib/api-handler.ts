import { ApiResponse } from './types/api';
import { handleApiError } from './error-handling';

export async function apiHandler<T>(
  promise: Promise<T>,
  errorMessage: string = 'Operation failed'
): Promise<ApiResponse<T>> {
  try {
    const data = await promise;
    return {
      data,
      status: 200
    };
  } catch (error) {
    const apiError = handleApiError(error, errorMessage);
    return {
      error: apiError.message,
      status: apiError.status,
      message: errorMessage
    };
  }
} 