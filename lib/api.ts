import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const getApiBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  return configuredUrl.endsWith('/api') ? configuredUrl : `${configuredUrl.replace(/\/$/, '')}/api`;
};

const ensureCsrfToken = async (): Promise<string | undefined> => {
  if (typeof window === 'undefined') return undefined;

  let csrfToken = Cookies.get('csrf-token');
  if (csrfToken) return csrfToken;

  // Bootstrap CSRF cookie on first use
  await axios.get(`${getApiBaseUrl()}/csrf-token`, { withCredentials: true });
  csrfToken = Cookies.get('csrf-token');
  return csrfToken;
};

const API: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

API.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = Cookies.get('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.method && ['post', 'put', 'delete', 'patch'].includes(config.method.toLowerCase()) && config.headers) {
    const csrfToken = await ensureCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
  }

  if (config.data instanceof FormData && config.headers) {
    delete config.headers['Content-Type'];
  } else if (config.headers) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login on 401 if it's not the login endpoint itself
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      Cookies.remove('token');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
