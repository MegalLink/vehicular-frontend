import axiosInstance from '../lib/axios';

// Types
export interface OrderItem {
  code: string;
  name?: string;
  price?: number;
  description?: string;
  quantity: number;
}

export interface UserOrderDetail {
  firstName: string;
  lastName: string;
  identityDocumentNumber: string;
  identityDocumentType: string;
  address: string;
  postalCode: string;
  city: string;
  province: string;
  phone: string;
}

export interface Order {
  orderID: string;
  userID: string;
  userDetail: UserOrderDetail;
  totalPrice: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  status: 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  userDetailID: string;
  items: {
    code: string;
    quantity: number;
  }[];
}

export interface GetOrdersParams {
  userID?: string;
  paymentStatus?: 'Paid' | 'Pending' | 'Failed';
  status?: 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';
  createdAt?: string;
}

export interface StripePaymentRequest {
  orderID: string;
  successURL: string;
  cancelURL: string;
  tax: number;
}

export interface StripePaymentResponse {
  url: string;
}

export const orderService = {
  // Services
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await axiosInstance.post('/order', orderData);
    return response.data;
  },

  getOrders: async (params?: GetOrdersParams): Promise<Order[]> => {
    const response = await axiosInstance.get('/order', { params });
    return response.data;
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await axiosInstance.get(`/order/${orderId}`);
    return response.data;
  },

  createStripePayment: async (paymentData: StripePaymentRequest): Promise<StripePaymentResponse> => {
    const response = await axiosInstance.post('/order/stripe-payment', paymentData);
    return response.data;
  },
};
