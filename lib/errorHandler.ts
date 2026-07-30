/**
 * Error Handler Utility
 * Converts API error responses into user-friendly messages
 */

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
}

/**
 * Get a user-friendly error message from an API error
 */
export const getErrorMessage = (error: any, fallbackMessage: string): string => {
  // Network errors
  if (!error.response) {
    return '🌐 Connection error. Please check your internet connection.';
  }

  const status = error.response?.status;
  const serverMessage = error.response?.data?.message || error.response?.data?.error;

  // Handle specific HTTP status codes
  switch (status) {
    case 400:
      return serverMessage || '⚠️ Invalid request. Please check your input.';
    case 401:
      return '🔒 Session expired. Please log in again.';
    case 403:
      return serverMessage || '🚫 You don\'t have permission to perform this action.';
    case 404:
      return '🔍 The requested resource was not found.';
    case 409:
      return serverMessage || '⚠️ This item already exists.';
    case 422:
      return serverMessage || '⚠️ Please check the information you entered.';
    case 429:
      return '⏱️ Too many requests. Please wait a moment and try again.';
    case 500:
      return '⚠️ Server error. Please try again later.';
    case 503:
      return '🔧 Service temporarily unavailable. Please try again later.';
    default:
      // Use server message if available and user-friendly
      if (serverMessage && serverMessage.length < 100) {
        return serverMessage;
      }
      return fallbackMessage;
  }
};

/**
 * Format validation errors from the server
 */
export const formatValidationErrors = (errors: any[]): string => {
  if (!errors || errors.length === 0) {
    return '⚠️ Please check your input and try again.';
  }

  const firstError = errors[0];
  if (firstError.message) {
    return firstError.message;
  }

  return '⚠️ Please check your input and try again.';
};
