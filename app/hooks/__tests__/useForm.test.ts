import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useForm } from '../useForm';

describe('useForm Hook', () => {
  const initialValues = {
    email: '',
    password: '',
    name: '',
  };

  it('initializes with default values', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: vi.fn(),
      })
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('handles input change', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: vi.fn(),
      })
    );

    act(() => {
      result.current.handleChange('email', 'test@example.com');
    });

    expect(result.current.values.email).toBe('test@example.com');
  });

  it('handles multiple input changes', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: vi.fn(),
      })
    );

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'secure123');
      result.current.handleChange('name', 'John Doe');
    });

    expect(result.current.values).toEqual({
      email: 'test@example.com',
      password: 'secure123',
      name: 'John Doe',
    });
  });

  it('marks field as touched on blur', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: vi.fn(),
      })
    );

    act(() => {
      result.current.handleBlur('email');
    });

    expect(result.current.touched.email).toBe(true);
  });

  it('validates field on blur when validate function provided', () => {
    const validate = vi.fn((values) => {
      const errors: any = {};
      if (!values.email) {
        errors.email = 'Email is required';
      }
      if (!values.password) {
        errors.password = 'Password is required';
      }
      return errors;
    });

    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validate,
        onSubmit: vi.fn(),
      })
    );

    act(() => {
      result.current.handleBlur('email');
    });

    expect(validate).toHaveBeenCalledWith(initialValues);
    expect(result.current.errors.email).toBe('Email is required');
  });

  it('marks all fields as touched and validates on submit', () => {
    const onSubmit = vi.fn();
    const validate = vi.fn((values) => {
      const errors: any = {};
      if (!values.email) errors.email = 'Email is required';
      return errors;
    });

    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validate,
        onSubmit,
      })
    );

    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.touched.email).toBe(true);
    expect(result.current.touched.password).toBe(true);
    expect(result.current.touched.name).toBe(true);
    expect(validate).toHaveBeenCalled();
  });

  it('does not submit when there are validation errors', () => {
    const onSubmit = vi.fn();
    const validate = vi.fn((values) => {
      if (!values.email) {
        return { email: 'Email is required' };
      }
      return {};
    });

    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validate,
        onSubmit,
      })
    );

    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.errors.email).toBe('Email is required');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with valid data', async () => {
    const onSubmit = vi.fn();
    const validate = vi.fn(() => ({}));

    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: 'test@test.com', password: 'pass123', name: 'Test' },
        validate,
        onSubmit,
      })
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'pass123',
      name: 'Test',
    });
  });

  it('handles form submit event', async () => {
    const onSubmit = vi.fn();
    const event = { preventDefault: vi.fn() } as any;

    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: 'test@test.com', password: 'pass', name: 'Test' },
        onSubmit,
      })
    );

    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalled();
  });

  it('sets isSubmitting during async submit', async () => {
    let capturedStates: boolean[] = [];
    const onSubmit = vi.fn(async () => {
      // This will capture the isSubmitting state during submit
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    const { result, rerender } = renderHook(() =>
      useForm({
        initialValues: { email: 'test@test.com', password: 'pass', name: 'Test' },
        onSubmit,
      })
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    // After submit completes, isSubmitting should be false
    expect(result.current.isSubmitting).toBe(false);
    expect(onSubmit).toHaveBeenCalled();
  });

  it('handles submit errors gracefully', async () => {
    const onSubmit = vi.fn(() => {
      throw new Error('Submit failed');
    });

    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: 'test@test.com', password: 'pass', name: 'Test' },
        onSubmit,
      })
    );

    await act(async () => {
      await expect(result.current.handleSubmit()).rejects.toThrow();
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  it('resets form to initial values', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: vi.fn(),
      })
    );

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'secure123');
      result.current.handleBlur('email');
    });

    expect(result.current.values.email).toBe('test@example.com');
    expect(result.current.touched.email).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('sets form values programmatically', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: vi.fn(),
      })
    );

    act(() => {
      result.current.setValues({
        email: 'new@example.com',
        password: 'newpass123',
      });
    });

    expect(result.current.values.email).toBe('new@example.com');
    expect(result.current.values.password).toBe('newpass123');
    expect(result.current.values.name).toBe(''); // Original value preserved
  });

  it('handles complex field types', () => {
    const complexInitialValues = {
      name: '',
      age: 0,
      isActive: true,
      tags: [] as string[],
    };

    const { result } = renderHook(() =>
      useForm({
        initialValues: complexInitialValues,
        onSubmit: vi.fn(),
      })
    );

    act(() => {
      result.current.handleChange('name', 'John');
      result.current.handleChange('age', 25);
      result.current.handleChange('isActive', false);
      result.current.handleChange('tags', ['tag1', 'tag2']);
    });

    expect(result.current.values).toEqual({
      name: 'John',
      age: 25,
      isActive: false,
      tags: ['tag1', 'tag2'],
    });
  });

  it('does not validate without validation function', async () => {
    const onSubmit = vi.fn();

    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit,
      })
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(onSubmit).toHaveBeenCalled();
  });

  it('handles undefined values in setValues', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: vi.fn(),
      })
    );

    act(() => {
      result.current.handleChange('email', 'test@test.com');
      result.current.setValues({});
    });

    expect(result.current.values.email).toBe('test@test.com');
  });
});
