import { beforeEach, describe, expect, it, vi } from 'vitest';
import API from '../api';
import { initiateEsewaPayment, verifyPaymentStatus } from '../payments';

vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('payment helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initiates eSewa payment through the backend initiation endpoint', async () => {
    (API.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          formData: { transaction_uuid: 'tx-123' },
          esewaUrl: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
        },
      },
    });

    const result = await initiateEsewaPayment('order-1');

    expect(API.post).toHaveBeenCalledWith('/payments/esewa/initiate', { orderId: 'order-1' });
    expect(result.formData.transaction_uuid).toBe('tx-123');
    expect(result.esewaUrl).toContain('esewa');
  });

  it('verifies payment status through the backend verification endpoint', async () => {
    (API.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { success: true, data: { paymentStatus: 'completed', orderStatus: 'confirmed' } },
    });

    const result = await verifyPaymentStatus('order-1');

    expect(API.get).toHaveBeenCalledWith('/payments/verify/order-1');
    expect(result.paymentStatus).toBe('completed');
    expect(result.orderStatus).toBe('confirmed');
  });
});
