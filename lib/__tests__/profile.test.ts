import { describe, it, beforeEach, expect, vi } from 'vitest';
import API from '../api';
import { getCurrentUser, updateProfile, changePassword, setup2FA, enable2FA, disable2FA } from '../profile';

vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
  },
}));

describe('profile helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches current user from /auth/me', async () => {
    (API.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { success: true, data: { user: { _id: 'abc', name: 'Test User', email: 'test@example.com' } } },
    });

    const result = await getCurrentUser();

    expect(API.get).toHaveBeenCalledWith('/auth/me');
    expect(result.name).toBe('Test User');
    expect(result.email).toBe('test@example.com');
  });

  it('updates profile through /users/profile', async () => {
    (API.put as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { success: true, data: { name: 'New Name' } },
    });

    const result = await updateProfile({ name: 'New Name' });

    expect(API.put).toHaveBeenCalledWith('/users/profile', { name: 'New Name' }, undefined);
    expect(result.name).toBe('New Name');
  });

  it('updates profile with FormData through /users/profile', async () => {
    const formData = new FormData();
    formData.append('name', 'New Name');

    (API.put as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { success: true, data: { name: 'New Name' } },
    });

    const result = await updateProfile(formData);

    expect(API.put).toHaveBeenCalledWith('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    expect(result.name).toBe('New Name');
  });

  it('changes password through /users/password', async () => {
    (API.put as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: { success: true } });

    const result = await changePassword('old', 'new');

    expect(API.put).toHaveBeenCalledWith('/users/password', { currentPassword: 'old', newPassword: 'new' });
    expect(result.success).toBe(true);
  });

  it('sets up 2FA through /users/2fa/setup', async () => {
    (API.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { success: true, secret: 'secret', qrCodeUrl: 'qrcode' },
    });

    const result = await setup2FA();

    expect(API.post).toHaveBeenCalledWith('/users/2fa/setup');
    expect(result.secret).toBe('secret');
  });

  it('enables 2FA through /users/2fa/enable', async () => {
    (API.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: { success: true } });

    const result = await enable2FA('123456');

    expect(API.post).toHaveBeenCalledWith('/users/2fa/enable', { token: '123456' });
    expect(result.success).toBe(true);
  });

  it('disables 2FA through /users/2fa/disable', async () => {
    (API.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: { success: true } });

    const result = await disable2FA('password');

    expect(API.post).toHaveBeenCalledWith('/users/2fa/disable', { password: 'password' });
    expect(result.success).toBe(true);
  });
});
