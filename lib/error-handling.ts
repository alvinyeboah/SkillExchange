import { toast } from 'sonner';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown, defaultMessage: string) => {
  if (error instanceof ApiError) {
    toast.error(error.message);
    return error;
  }
  const message = error instanceof Error ? error.message : defaultMessage;
  toast.error(message);
  return new ApiError(message);
};

export const createErrorResponse = (message: string, status: number = 500) => {
  return new Response(
    JSON.stringify({
      error: message,
      status,
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}; 