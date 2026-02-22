import { useState, useCallback } from 'react';

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
}

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void | Promise<void>;
}

/**
 * Custom hook for form handling with validation
 * Provides form state management and validation
 * @template T - Type of form values
 * @param {UseFormOptions<T>} options - Form configuration
 * @returns {Object} Form state and handlers
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input change
   */
  const handleChange = useCallback((name: keyof T, value: any) => {
    setState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: value,
      },
    }));
  }, []);

  /**
   * Handle input blur
   */
  const handleBlur = useCallback((name: keyof T) => {
    setState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [name]: true,
      },
    }));

    if (validate) {
      const errors = validate(state.values);
      setState(prev => ({
        ...prev,
        errors,
      }));
    }
  }, [validate, state.values]);

  /**
   * Handle form submit
   */
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Mark all fields as touched
    const allTouched = Object.keys(state.values).reduce((acc, key) => ({
      ...acc,
      [key]: true,
    }), {});

    setState(prev => ({
      ...prev,
      touched: allTouched,
    }));

    // Validate
    if (validate) {
      const errors = validate(state.values);
      setState(prev => ({
        ...prev,
        errors,
      }));

      if (Object.keys(errors).length > 0) {
        return;
      }
    }

    // Submit
    setIsSubmitting(true);
    try {
      await onSubmit(state.values);
    } finally {
      setIsSubmitting(false);
    }
  }, [state.values, validate, onSubmit]);

  /**
   * Reset form to initial values
   */
  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
    });
  }, [initialValues]);

  /**
   * Set form values programmatically
   */
  const setValues = useCallback((values: Partial<T>) => {
    setState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        ...values,
      },
    }));
  }, []);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
  };
}
