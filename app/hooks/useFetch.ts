import { useState, useEffect } from 'react';
import API from '@/lib/api';
import { AxiosError } from 'axios';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface FetchOptions {
  immediate?: boolean;
}

/**
 * Custom hook for fetching data from API
 * Provides loading, error states and refetch functionality
 * @template T - Type of data to be fetched
 * @param {string} url - API endpoint URL
 * @param {FetchOptions} options - Fetch options
 * @returns {Object} Fetch state and refetch function
 */
export function useFetch<T>(url: string, options: FetchOptions = { immediate: true }) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: options.immediate ?? true,
    error: null,
  });

  const fetchData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await API.get(url);
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setState({
        data: null,
        loading: false,
        error: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  useEffect(() => {
    if (options.immediate) {
      fetchData();
    }
  }, [url]);

  return {
    ...state,
    refetch: fetchData,
  };
}

/**
 * Custom hook for POST/PUT/DELETE operations
 * Provides loading and error states for mutations
 * @template T - Type of request data
 * @template R - Type of response data
 * @returns {Object} Mutation state and execute function
 */
export function useMutation<T = any, R = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (
    method: 'post' | 'put' | 'delete',
    url: string,
    data?: T
  ): Promise<R | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await API[method](url, data as any);
      setLoading(false);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMessage = error.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  return {
    loading,
    error,
    execute,
  };
}
