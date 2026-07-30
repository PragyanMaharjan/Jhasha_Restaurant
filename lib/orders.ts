import API from './api';

export interface OrderItemPayload {
  product?: string;
  name?: string;
  price?: number;
  quantity?: number;
  image?: string;
  foodId?: { _id?: string; name?: string; image?: string; price?: number };
  _id?: string;
}

export interface OrderPayload {
  _id?: string;
  orderNumber?: string;
  orderStatus?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  totalAmount?: number;
  total?: number;
  subtotal?: number;
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryZipCode?: string;
  phoneNumber?: string;
  notes?: string;
  items?: OrderItemPayload[];
  createdAt?: string;
  updatedAt?: string;
  coupon?: { code?: string; discountAmount?: number };
}

export interface PrepareOrderPayload {
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
    country?: string;
  };
  paymentMethod?: string;
  couponCode?: string;
  notes?: string;
}

export const prepareOrder = async (payload: PrepareOrderPayload) => {
  const response = await API.post('/orders/prepare', payload);
  return response.data?.data ?? response.data?.order ?? response.data;
};

export const getMyOrders = async () => {
  const response = await API.get('/orders');
  const payload = response.data?.data ?? response.data;
  return payload?.orders ?? payload?.data ?? [];
};

export const getOrderById = async (orderId: string) => {
  const response = await API.get(`/orders/${orderId}`);
  return response.data?.data ?? response.data?.order ?? response.data;
};

export const verifyCoupon = async (couponCode: string, cartTotal: number) => {
  const response = await API.post('/orders/verify-coupon', { couponCode, cartTotal });
  return response.data?.data ?? response.data;
};

export const cancelOrder = async (orderId: string) => {
  const response = await API.put(`/orders/${orderId}/cancel`);
  return response.data;
};
