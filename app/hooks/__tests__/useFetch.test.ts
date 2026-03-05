import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFetch, useMutation } from '../useFetch';
import API from '@/lib/api';
import { AxiosError } from 'axios';

vi.mock('@/lib/api');

describe('useFetch Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useFetch', () => {
    it('fetches data immediately by default', async () => {
      const mockData = { id: 1, name: 'Test' };
      (API.get as any).mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => useFetch('/api/test'));

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeNull();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
      expect(API.get).toHaveBeenCalledWith('/api/test');
    });

    it('does not fetch when immediate is false', () => {
      const mockData = { id: 1, name: 'Test' };
      (API.get as any).mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => useFetch('/api/test', { immediate: false }));

      expect(result.current.loading).toBe(false);
      expect(API.get).not.toHaveBeenCalled();
    });

    it('handles API errors with server message', async () => {
      const error = new AxiosError();
      error.response = {
        status: 400,
        statusText: '',
        headers: {},
        config: {} as any,
        data: { message: 'Invalid input' }
      };
      (API.get as any).mockRejectedValue(error);

      const { result } = renderHook(() => useFetch('/api/test'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe('Invalid input');
    });

    it('handles API errors with fallback message', async () => {
      const error = new AxiosError();
      error.response = {
        status: 500,
        statusText: '',
        headers: {},
        config: {} as any,
        data: {}
      };
      (API.get as any).mockRejectedValue(error);

      const { result } = renderHook(() => useFetch('/api/test'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('An error occurred');
    });

    it('refetches data when refetch is called', async () => {
      const mockData = { id: 1, name: 'Test' };
      (API.get as any).mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => useFetch('/api/test', { immediate: false }));

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      expect(API.get).toHaveBeenCalledWith('/api/test');
    });

    it('updates loading state during refetch', async () => {
      let resolveRequest: any;
      const promise = new Promise(resolve => {
        resolveRequest = resolve;
      });
      (API.get as any).mockReturnValue(promise);

      const { result } = renderHook(() => useFetch('/api/test', { immediate: false }));

      let refetchPromise: Promise<void>;
      await act(async () => {
        refetchPromise = result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      resolveRequest({ data: { id: 1 } });
      await refetchPromise!;

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('handles URL changes', async () => {
      const mockData1 = { id: 1 };
      const mockData2 = { id: 2 };
      (API.get as any)
        .mockResolvedValueOnce({ data: mockData1 })
        .mockResolvedValueOnce({ data: mockData2 });

      const { result, rerender } = renderHook(
        ({ url }: { url: string }) => useFetch(url),
        { initialProps: { url: '/api/test1' } }
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData1);
      });

      rerender({ url: '/api/test2' });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData2);
      });

      expect(API.get).toHaveBeenCalledWith('/api/test1');
      expect(API.get).toHaveBeenCalledWith('/api/test2');
    });
  });

  describe('useMutation', () => {
    it('executes POST request', async () => {
      const mockResponse = { success: true };
      (API.post as any).mockResolvedValue({ data: mockResponse });

      const { result } = renderHook(() => useMutation());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();

      const response = await result.current.execute('post', '/api/test', { name: 'test' });

      expect(response).toEqual(mockResponse);
      expect(API.post).toHaveBeenCalledWith('/api/test', { name: 'test' });
    });

    it('executes PUT request', async () => {
      const mockResponse = { success: true };
      (API.put as any).mockResolvedValue({ data: mockResponse });

      const { result } = renderHook(() => useMutation());

      const response = await result.current.execute('put', '/api/test/1', { name: 'updated' });

      expect(response).toEqual(mockResponse);
      expect(API.put).toHaveBeenCalledWith('/api/test/1', { name: 'updated' });
    });

    it('executes DELETE request', async () => {
      const mockResponse = { success: true };
      (API.delete as any).mockResolvedValue({ data: mockResponse });

      const { result } = renderHook(() => useMutation());

      const response = await result.current.execute('delete', '/api/test/1');

      expect(response).toEqual(mockResponse);
      expect(API.delete).toHaveBeenCalledWith('/api/test/1', undefined);
    });

    it('handles mutation errors', async () => {
      const error = new AxiosError();
      error.response = {
        status: 400,
        statusText: '',
        headers: {},
        config: {} as any,
        data: { message: 'Validation failed' }
      };
      (API.post as any).mockRejectedValue(error);

      const { result } = renderHook(() => useMutation());

      const response = await act(async () =>
        result.current.execute('post', '/api/test', { name: 'test' })
      );

      expect(response).toBeNull();
      await waitFor(() => {
        expect(result.current.error).toBe('Validation failed');
      });
    });

    it('handles mutation with fallback error message', async () => {
      const error = new AxiosError();
      error.response = {
        status: 500,
        statusText: '',
        headers: {},
        config: {} as any,
        data: {}
      };
      (API.post as any).mockRejectedValue(error);

      const { result } = renderHook(() => useMutation());

      const response = await act(async () =>
        result.current.execute('post', '/api/test', {})
      );

      expect(response).toBeNull();
      await waitFor(() => {
        expect(result.current.error).toBe('An error occurred');
      });
    });

    it('manages loading state during mutation', async () => {
      let resolveRequest: any;
      const promise = new Promise(resolve => {
        resolveRequest = resolve;
      });
      (API.post as any).mockReturnValue(promise);

      const { result } = renderHook(() => useMutation());

      let mutationPromise: Promise<any>;
      await act(async () => {
        mutationPromise = result.current.execute('post', '/api/test', {});
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      resolveRequest({ data: { success: true } });
      await mutationPromise!;

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('clears error on new mutation', async () => {
      const error = new AxiosError();
      error.response = {
        status: 400,
        statusText: '',
        headers: {},
        config: {} as any,
        data: { message: 'Error' }
      };
      (API.post as any)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce({ data: { success: true } });

      const { result } = renderHook(() => useMutation());

      await act(async () => {
        await result.current.execute('post', '/api/test', {});
      });
      await waitFor(() => {
        expect(result.current.error).toBe('Error');
      });

      await act(async () => {
        await result.current.execute('post', '/api/test', {});
      });
      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });
});
