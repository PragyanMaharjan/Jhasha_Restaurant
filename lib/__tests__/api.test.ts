import { describe, it, expect, beforeEach, vi } from 'vitest';
import API from '@/lib/api';
import Cookies from 'js-cookie';
import axios from 'axios';

vi.mock('js-cookie');
vi.mock('axios');

describe('API Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (Cookies.get as any).mockReturnValue(null);
  });

  it('creates axios instance with correct baseURL', () => {
    expect(API.defaults.baseURL).toBe('http://localhost:5000/api');
  });

  it('sets authorization header when token exists', () => {
    (Cookies.get as any).mockReturnValue('test-token-123');
    
    const config = { headers: {} };
    API.interceptors.request.handlers[0].fulfilled(config);

    expect(config.headers?.Authorization).toBe('Bearer test-token-123');
  });

  it('does not set authorization header when token is missing', () => {
    (Cookies.get as any).mockReturnValue(null);
    
    const config = { headers: {} };
    API.interceptors.request.handlers[0].fulfilled(config);

    expect(config.headers?.Authorization).toBeUndefined();
  });

  it('removes token and redirects on 401 response', () => {
    delete (window as any).location;
    window.location = { href: 'http://localhost' } as any;
    
    (Cookies.remove as any).mockClear();
    
    const error = {
      response: { status: 401 },
    };
    
    expect(() => {
      API.interceptors.response.handlers[0].rejected(error);
    }).toThrow();

    expect(Cookies.remove).toHaveBeenCalledWith('token');
  });

  it('passes through response errors', (done) => {
    const error = {
      response: { status: 500, data: { message: 'Server error' } },
    };

    API.interceptors.response.handlers[0].rejected(error).catch((err: any) => {
      expect(err.response.status).toBe(500);
      done();
    });
  });
});
