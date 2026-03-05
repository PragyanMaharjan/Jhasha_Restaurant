import { describe, test, expect, it } from 'vitest';
import { getErrorMessage, formatValidationErrors } from '../errorHandler';

describe('Error Handler Utility', () => {
  describe('getErrorMessage', () => {
    test('should return connection error message when no response', () => {
      const error = {
        message: 'Network Error'
      };
      
      const result = getErrorMessage(error, 'Fallback message');
      
      expect(result).toContain('Connection error');
      expect(result).toContain('internet connection');
    });

    test('should handle 400 Bad Request error', () => {
      const error = {
        response: {
          status: 400,
          data: {
            message: 'Invalid input data'
          }
        }
      };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toBe('Invalid input data');
    });

    test('should handle 400 with default message', () => {
      const error = {
        response: {
          status: 400,
          data: {}
        }
      };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toContain('Invalid request');
    });

    test('should handle 401 Unauthorized error', () => {
      const error = {
        response: {
          status: 401
        }
      };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toContain('Session expired');
      expect(result).toContain('log in again');
    });

    test('should handle 403 Forbidden error', () => {
      const error = {
        response: {
          status: 403
        }
      };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toContain('permission');
    });

    test('should handle 404 Not Found error', () => {
      const error = {
        response: {
          status: 404
        }
      };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toContain('not found');
    });

    test('should handle 409 Conflict error with server message', () => {
      const error = {
        response: {
          status: 409,
          data: {
            message: 'Email already exists'
          }
        }
      };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toBe('Email already exists');
    });

    test('should handle 409 with default message', () => {
      const error = {
        response: {
          status: 409,
          data: {}
        }
      };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toContain('already exists');
    });

    test('should handle 422 Unprocessable Entity error with message', () => {
      const error = {
        response: {
          status: 422,
          data: {
            message: 'Validation failed'
          }
        }
      };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toBe('Validation failed');
    });

    test('should handle 422 with default message', () => {
      const error = {
        response: {
          status: 422,
          data: {}
        }
      };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toContain('check the information');
    });

    test('should handle 429 Too Many Requests error', () => {
      const error = {
        response: {
          status: 429
        }
      };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toContain('Too many requests');
      expect(result).toContain('wait');
    });

    test('should handle 500 Internal Server Error', () => {
      const error = {
        response: {
          status: 500
        }
      };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toContain('Server error');
      expect(result).toContain('try again later');
    });

    test('should handle 503 Service Unavailable error', () => {
      const error = {
        response: {
          status: 503
        }
      };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toContain('temporarily unavailable');
    });

    test('should use short server message for unknown status codes', () => {
      const error = {
        response: {
          status: 418,
          data: {
            message: 'I am a teapot'
          }
        }
      };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toBe('I am a teapot');
    });

    test('should use fallback for long server messages (>100 chars)', () => {
      const longMessage = 'x'.repeat(150);
      const error = {
        response: {
          status: 418,
          data: {
            message: longMessage
          }
        }
      };
      
      const result = getErrorMessage(error, 'Custom fallback message');
      
      expect(result).toBe('Custom fallback message');
    });

    test('should use fallback message when no server message', () => {
      const error = {
        response: {
          status: 418
        }
      };
      
      const result = getErrorMessage(error, 'Custom fallback message');
      
      expect(result).toBe('Custom fallback message');
    });

    test('should handle error object without data', () => {
      const error = {
        response: {
          status: 400
        }
      };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toContain('Invalid request');
    });

    test('should handle data.error instead of data.message', () => {
      const error = {
        response: {
          status: 400,
          data: {
            error: 'Specific error occurred'
          }
        }
      };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toBe('Specific error occurred');
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
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toBe('Message text');
    });

    test('should handle null error gracefully', () => {
      const result = getErrorMessage(null, 'Fallback message');
      
      expect(result).toContain('Connection error');
    });

    test('should handle undefined error gracefully', () => {
      const result = getErrorMessage(undefined, 'Fallback message');
      
      expect(result).toContain('Connection error');
    });

    test('should return connection error for error without response', () => {
      const error = { message: 'Some error' };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toContain('Connection error');
    });

    test('should handle null response', () => {
      const error = { response: null };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toContain('Connection error');
    });

    test('should handle null data in response', () => {
      const error = {
        response: {
          status: 400,
          data: null
        }
      };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result).toContain('Invalid request');
    });

    test('should handle undefined status', () => {
      const error = {
        response: {
          status: undefined,
          data: { message: 'Error message' }
        }
      };
      
      const result = getErrorMessage(error, 'Error message');
      
      expect(result).toBeDefined();
    });
  });

  describe('formatValidationErrors', () => {
    test('should return default message for empty errors array', () => {
      const result = formatValidationErrors([]);
      
      expect(result).toContain('check your input');
    });

    test('should return default message for null errors', () => {
      const result = formatValidationErrors(null as any);
      
      expect(result).toContain('check your input');
    });

    test('should return default message for undefined errors', () => {
      const result = formatValidationErrors(undefined as any);
      
      expect(result).toContain('check your input');
    });

    test('should return first error message', () => {
      const errors = [
        { message: 'Name is required' },
        { message: 'Email is invalid' }
      ];
      
      const result = formatValidationErrors(errors);
      
      expect(result).toBe('Name is required');
    });

    test('should handle single error', () => {
      const errors = [
        { message: 'Password must be at least 6 characters' }
      ];
      
      const result = formatValidationErrors(errors);
      
      expect(result).toBe('Password must be at least 6 characters');
    });

    test('should return default message when error has no message property', () => {
      const errors = [
        { field: 'email', code: 'invalid' }
      ];
      
      const result = formatValidationErrors(errors);
      
      expect(result).toContain('check your input');
    });

    test('should handle errors with empty message', () => {
      const errors = [
        { message: '' }
      ];
      
      const result = formatValidationErrors(errors);
      
      expect(result).toContain('check your input');
    });

    test('should handle multiple errors and return first', () => {
      const errors = [
        { message: 'First error' },
        { message: 'Second error' },
        { message: 'Third error' }
      ];
      
      const result = formatValidationErrors(errors);
      
      expect(result).toBe('First error');
    });

    test('should handle error without message property in first position', () => {
      const errors = [
        { code: 'ERROR' },
        { message: 'Second error with message' }
      ];
      
      const result = formatValidationErrors(errors);
      
      expect(result).toContain('check your input');
    });
  });

  describe('Error message consistency', () => {
    test('getErrorMessage should always return a string', () => {
      const error = { response: { status: 500 } };
      
      const result = getErrorMessage(error, 'Default');
      
      expect(typeof result).toBe('string');
    });

    test('formatValidationErrors should always return a string', () => {
      const errors = [{ message: 'Test' }];
      
      const result = formatValidationErrors(errors);
      
      expect(typeof result).toBe('string');
    });

    test('should never return empty string from getErrorMessage', () => {
      const error = { response: { status: 999 } };
      
      const result = getErrorMessage(error, 'Fallback');
      
      expect(result.length > 0).toBe(true);
    });

    test('should never return empty string from formatValidationErrors', () => {
      const result = formatValidationErrors(null);
      
      expect(result.length > 0).toBe(true);
    });
  });
});
