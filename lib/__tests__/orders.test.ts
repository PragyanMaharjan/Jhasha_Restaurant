import { beforeEach, describe, expect, it, vi } from 'vitest';
import API from '../api';
import { cancelOrder, getMyOrders, getOrderById, prepareOrder, verifyCoupon } from '../orders';

vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('order helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('prepares an order through the backend prepare endpoint', async () => {
    (API.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { success: true, data: { _id: 'order-1', orderStatus: 'pending' } },
    });

    const order = await prepareOrder({
      shippingAddress: {
        fullName: 'Test User',
        phone: '+977 9812345678',
        address: 'Main Street',
        city: 'Kathmandu',
        postalCode: '44600',
        country: 'Nepal',
      },
      paymentMethod: 'stripe',
      notes: 'No onions',
    });

    expect(API.post).toHaveBeenCalledWith('/orders/prepare', expect.objectContaining({
      shippingAddress: expect.objectContaining({ address: 'Main Street' }),
      paymentMethod: 'stripe',
      notes: 'No onions',
    }));
    expect(order._id).toBe('order-1');
  });

  it('reads the my-orders list from the backend', async () => {
    (API.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { success: true, data: { orders: [{ _id: 'a' }] } },
    });

    const orders = await getMyOrders();

    expect(API.get).toHaveBeenCalledWith('/orders');
    expect(orders).toHaveLength(1);
  });

  it('loads a single order by id from the backend', async () => {
    (API.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { success: true, data: { _id: 'b', orderStatus: 'confirmed' } },
    });

    const order = await getOrderById('b');

    expect(API.get).toHaveBeenCalledWith('/orders/b');
    expect(order._id).toBe('b');
  });

  it('verifies a coupon using the backend coupon endpoint', async () => {
    (API.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { success: true, data: { code: 'SAVE10', discount: 100, newTotal: 900 } },
    });

    const result = await verifyCoupon('SAVE10', 1000);

    expect(API.post).toHaveBeenCalledWith('/orders/verify-coupon', { couponCode: 'SAVE10', cartTotal: 1000 });
    expect(result.newTotal).toBe(900);
  });

  it('cancels an order through the backend cancel endpoint', async () => {
    (API.put as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { success: true, message: 'Order cancelled' },
    });

    const result = await cancelOrder('c');

    expect(API.put).toHaveBeenCalledWith('/orders/c/cancel');
    expect(result.success).toBe(true);
  });
});
