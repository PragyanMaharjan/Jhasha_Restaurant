// vitest.helpers.ts - Reusable test utilities and mock factories
import { vi } from 'vitest';
import Cookies from 'js-cookie';

vi.mock('js-cookie');
vi.mock('next/navigation');
vi.mock('@/lib/store');
vi.mock('@/lib/storeProvider');

export const createMockAuthStore = (overrides = {}) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setUser: vi.fn(),
  setToken: vi.fn(),
  logout: vi.fn(),
  ...overrides,
});

export const createMockCartStore = (overrides = {}) => ({
  cart: [],
  total: 0,
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
  updateQuantity: vi.fn(),
  clearCart: vi.fn(),
  ...overrides,
});

export const createMockRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
});

export const createMockAPI = () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
  interceptors: {
    request: { handlers: [] },
    response: { handlers: [] },
  },
  defaults: {
    baseURL: 'http://localhost:5000/api',
  },
});

export const setupMockStores = (authOverrides = {}, cartOverrides = {}) => {
  const mockAuthStore = createMockAuthStore(authOverrides);
  const mockCartStore = createMockCartStore(cartOverrides);
  
  return { mockAuthStore, mockCartStore };
};

export const expectToBeRendered = (element: HTMLElement | null | undefined) => {
  expect(element).toBeTruthy();
  expect(element).toBeInTheDocument?.() ??  expect(element).not.toBeNull();
};

export const createTestRequest = (overrides = {}) => ({
  method: 'GET',
  url: '/api/test',
  data: null,
  status: 200,
  ...overrides,
});

export const createTestResponse = (data = {}, overrides = {}) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  ...overrides,
});

export const mockLocalStorage = () => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
};

export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));
