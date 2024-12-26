type ErrorResponse = {
  message: string;
  code?: string;
  details?: unknown;
};

export const handleApiError = (error: unknown): ErrorResponse => {
  if (error instanceof Response) {
    return {
      message: 'Server error occurred',
      code: error.status.toString(),
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      details: error.stack,
    };
  }
  
  return {
    message: 'An unexpected error occurred',
    details: error,
  };
}; 