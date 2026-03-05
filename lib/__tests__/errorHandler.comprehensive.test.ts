import { describe, test, expect } from 'vitest';
import { getErrorMessage, formatValidationErrors } from '../errorHandler';

describe('errorHandler - Comprehensive Coverage', () => {
  describe('getErrorMessage', () => {
    test('should return connection error message when no response', () => {
      const error = { message: 'Network Error' };
      expect(getErrorMessage(error)).toBe('Unable to connect to server. Please check your internet connection.');
    });

    test('should handle 400 Bad Request error', () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid input' }
        }
      };
      expect(getErrorMessage(error)).toBe('Invalid input');
    });

    test('should handle 400 with default message', () => {
      const error = {
        response: {
          status: 400,
          data: {}
        }
      };
      expect(getErrorMessage(error)).toBe('Bad request. Please check your input.');
    });

    test('should handle 401 Unauthorized error', () => {
      const error = {
        response: {
          status: 401,
          data: {}
        }
      };
      expect(getErrorMessage(error)).toBe('Session expired. Please login again.');
    });

    test('should handle 403 Forbidden error', () => {
      const error = {
        response: {
          status: 403,
          data: {}
        }
      };
      expect(getErrorMessage(error)).toBe('You do not have permission to perform this action.');
    });

    test('should handle 404 Not Found error', () => {
      const error = {
        response: {
          status: 404,
          data: {}
        }
      };
      expect(getErrorMessage(error)).toBe('The requested resource was not found.');
    });

    test('should handle 409 Conflict error with server message', () => {
      const error = {
        response: {
          status: 409,
          data: { message: 'Email already exists' }
        }
      };
      expect(getErrorMessage(error)).toBe('Email already exists');
    });

    test('should handle 409 with default message', () => {
      const error = {
        response: {
          status: 409,
          data: {}
        }
      };
      expect(getErrorMessage(error)).toBe('A conflict occurred. The resource may already exist.');
    });

    test('should handle 422 Unprocessable Entity error with message', () => {
      const error = {
        response: {
          status: 422,
          data: { message: 'Validation failed' }
        }
      };
      expect(getErrorMessage(error)).toBe('Validation failed');
    });

    test('should handle 422 with default message', () => {
      const error = {
        response: {
          status: 422,
          data: {}
        }
      };
      expect(getErrorMessage(error)).toBe('The provided data could not be processed.');
    });

    test('should handle 429 Too Many Requests error', () => {
      const error = {
        response: {
          status: 429,
          data: {}
        }
      };
      expect(getErrorMessage(error)).toBe('Too many requests. Please try again later.');
    });

    test('should handle 500 Internal Server Error', () => {
      const error = {
        response: {
          status: 500,
          data: {}
        }
      };
      expect(getErrorMessage(error)).toBe('Internal server error. Please try again later.');
    });

    test('should handle 503 Service Unavailable error', () => {
      const error = {
        response: {
          status: 503,
          data: {}
        }
      };
      expect(getErrorMessage(error)).toBe('Service temporarily unavailable. Please try again later.');
    });

    test('should use short server message for unknown status codes', () => {
      const error = {
        response: {
          status: 418,
          data: { message: 'I am a teapot' }
        }
      };
      expect(getErrorMessage(error)).toBe('I am a teapot');
    });

    test('should use fallback for long server messages (>100 chars)', () => {
      const error = {
        response: {
          status: 418,
          data: { message: 'a'.repeat(150) }
        }
      };
      expect(getErrorMessage(error)).toBe('An error occurred. Please try again.');
    });

    test('should use fallback message when no server message', () => {
      const error = {
        response: {
          status: 418,
          data: {}
        }
      };
      expect(getErrorMessage(error)).toBe('An error occurred. Please try again.');
    });

    test('should handle error object without data', () => {
      const error = {
        response: {
          status: 500
        }
      };
      expect(getErrorMessage(error)).toBe('Internal server error. Please try again later.');
    });

    test('should handle data.error instead of data.message', () => {
      const error = {
        response: {
          status: 400,
          data: { error: 'Custom error' }
        }
      };
      expect(getErrorMessage(error)).toBe('Custom error');
    });

    test('should prioritize data.message over data.error', () => {
      const error = {
        response: {
          status: 400,
          data: { 
            message: 'Message text',
            error: 'Error text'
          }
        }
      };
      expect(getErrorMessage(error)).toBe('Message text');
    });

    test('should handle null error gracefully', () => {
      expect(getErrorMessage(null)).toBe('An unexpected error occurred.');
    });

    test('should handle undefined error gracefully', () => {
      expect(getErrorMessage(undefined)).toBe('An unexpected error occurred.');
    });

    test('should return connection error for error without response', () => {
      const error = { message: 'timeout' };
      expect(getErrorMessage(error)).toBe('Unable to connect to server. Please check your internet connection.');
    });

    test('should handle null response', () => {
      const error = {
        response: null
      };
      expect(getErrorMessage(error)).toBe('Unable to connect to server. Please check your internet connection.');
    });

    test('should handle null data in response', () => {
      const error = {
        response: {
          status: 500,
          data: null
        }
      };
      expect(getErrorMessage(error)).toBe('Internal server error. Please try again later.');
    });

    test('should handle undefined status', () => {
      const error = {
        response: {
          data: { message: 'Error' }
        }
      };
      expect(getErrorMessage(error)).toBe('Error');
    });
  });

  describe('formatValidationErrors', () => {
    test('should return default message for empty errors array', () => {
      expect(formatValidationErrors([])).toBe('Validation failed. Please check your input.');
    });

    test('should return default message for null errors', () => {
      expect(formatValidationErrors(null)).toBe('Validation failed. Please check your input.');
    });

    test('should return default message for undefined errors', () => {
      expect(formatValidationErrors(undefined)).toBe('Validation failed. Please check your input.');
    });

    test('should return first error message', () => {
      const errors = [
        { message: 'Email is required' },
        { message: 'Password is required' }
      ];
      expect(formatValidationErrors(errors)).toBe('Email is required');
    });

    test('should handle single error', () => {
      const errors = [{ message: 'Invalid email format' }];
      expect(formatValidationErrors(errors)).toBe('Invalid email format');
    });

    test('should return default message when error has no message property', () => {
      const errors = [{ field: 'email' }];
      expect(formatValidationErrors(errors)).toBe('Validation failed. Please check your input.');
    });

    test('should handle errors with empty message', () => {
      const errors = [{ message: '' }];
      expect(formatValidationErrors(errors)).toBe('Validation failed. Please check your input.');
    });

    test('should handle multiple errors and return first', () => {
      const errors = [
        { message: 'First error' },
        { message: 'Second error' },
        { message: 'Third error' }
      ];
      expect(formatValidationErrors(errors)).toBe('First error');
    });

    test('should handle error without message property in first position', () => {
      const errors = [
        { field: 'email' },
        { message: 'Password required' }
      ];
      expect(formatValidationErrors(errors)).toBe('Validation failed. Please check your input.');
    });

    test('getErrorMessage should always return a string', () => {
      const result = getErrorMessage({});
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('formatValidationErrors should always return a string', () => {
      const result = formatValidationErrors([]);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('should never return empty string from getErrorMessage', () => {
      const error = { response: { status: 999, data: {} } };
      const result = getErrorMessage(error);
      expect(result).not.toBe('');
    });

    test('should never return empty string from formatValidationErrors', () => {
      const result = formatValidationErrors([{ message: '' }]);
      expect(result).not.toBe('');
    });
  });
});
