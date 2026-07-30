import API from './api';

export interface UserAddresses {
  address?: string;
  city?: string;
  zipCode?: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  profileImage?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  twoFactorEnabled?: boolean;
  isEmailVerified?: boolean;
  createdAt?: string;
}

export interface ProfileUpdatePayload {
  name: string;
  phone?: string;
  addresses?: UserAddresses;
  address?: string;
  city?: string;
  zipCode?: string;
}

export interface TwoFASetupResponse {
  secret: string;
  qrCodeUrl: string;
}

export interface TwoFAStatusResponse {
  twoFactorEnabled?: boolean;
}

export const getCurrentUser = async (): Promise<UserProfile> => {
  const response = await API.get('/auth/me');
  return response.data?.data?.user ?? response.data?.user ?? response.data;
};

export const updateProfile = async (payload: ProfileUpdatePayload | FormData) => {
  const config = payload instanceof FormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : undefined;

  const response = await API.put('/users/profile', payload as any, config);
  return response.data?.data ?? response.data;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const response = await API.put('/users/password', { currentPassword, newPassword });
  return response.data;
};

export const setup2FA = async (): Promise<TwoFASetupResponse> => {
  const response = await API.post('/users/2fa/setup');
  return response.data ?? response.data?.data ?? response.data;
};

export const enable2FA = async (token: string) => {
  const response = await API.post('/users/2fa/enable', { token });
  return response.data;
};

export const disable2FA = async (password: string) => {
  const response = await API.post('/users/2fa/disable', { password });
  return response.data;
};
