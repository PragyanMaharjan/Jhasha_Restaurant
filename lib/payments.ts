import API from './api';

export interface EsewaInitiationResponse {
  formData?: Record<string, unknown>;
  esewaUrl?: string;
  transactionUUID?: string;
}

export interface PaymentVerificationResponse {
  paymentStatus?: string;
  orderStatus?: string;
}

export const initiateEsewaPayment = async (orderId: string) => {
  const response = await API.post('/payments/esewa/initiate', { orderId });
  return response.data?.data ?? response.data;
};

export const verifyPaymentStatus = async (orderId: string) => {
  const response = await API.get(`/payments/verify/${orderId}`);
  return response.data?.data ?? response.data;
};
