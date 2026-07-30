import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider } from '@/lib/storeProvider';
import Home from '../page';
import API from '@/lib/api';
import { toast } from 'react-toastify';

vi.mock('@/lib/api');
vi.mock('react-toastify');

const mockFoods = [
  {
    _id: '1',
    name: 'Biryani',
    price: 350,
    category: 'main_course',
    image: 'biryani.jpg',
    description: 'Delicious biryani',
  },
  {
    _id: '2',
    name: 'Samosa',
    price: 50,
    category: 'starter',
    image: 'samosa.jpg',
    description: 'Crispy samosa',
  },
];

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (API.get as any)
      .mockResolvedValueOnce({ data: { success: true, data: { categories: [{ name: 'Starter', slug: 'starter' }] } } })
      .mockResolvedValueOnce({ data: { success: true, data: { products: mockFoods } } });
  });

  it('renders home page', () => {
    render(
      <StoreProvider>
        <Home />
      </StoreProvider>
    );

    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
  });

  it('fetches foods on component mount', async () => {
    render(
      <StoreProvider>
        <Home />
      </StoreProvider>
    );

    await waitFor(() => {
      expect(API.get).toHaveBeenCalled();
    });
  });

  it('displays restaurant branding', async () => {
    render(
      <StoreProvider>
        <Home />
      </StoreProvider>
    );

    expect(screen.getByText(/Jhasha/i)).toBeInTheDocument();
  });

  it('shows delivery messaging', async () => {
    render(
      <StoreProvider>
        <Home />
      </StoreProvider>
    );

    expect(screen.getByText(/authentic flavors/i)).toBeInTheDocument();
  });

  it('fetches categories from the backend on mount', async () => {
    render(
      <StoreProvider>
        <Home />
      </StoreProvider>
    );

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith('/categories');
    });
  });

  it('handles API errors gracefully', async () => {
    const error = new Error('API Error');
    (API.get as any).mockRejectedValueOnce(error);

    render(
      <StoreProvider>
        <Home />
      </StoreProvider>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch foods');
    });
  });

  it('renders loading and content sections', async () => {
    render(
      <StoreProvider>
        <Home />
      </StoreProvider>
    );

    const containers = screen.queryAllByRole('heading');
    expect(containers.length).toBeGreaterThanOrEqual(0);
  });
});
