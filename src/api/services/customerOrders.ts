import { API_CONFIG } from "../config";

export interface CustomerOrderItem {
  product: string | null;
  quantity: number;
  price: number;
  discount: number;
  total: number;
  _id: string;
}

export interface CustomerOrderAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface CustomerOrderCustomer {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface CustomerOrder {
  _id: string;
  customer: string | CustomerOrderCustomer;
  items: CustomerOrderItem[];
  totalAmount: number;
  subTotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  paymentMethod: string;
  paymentStatus: "pending" | "completed" | "failed" | "refunded" | "processing";
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  trackingNumber: string;
  estimatedDelivery: string;
  actualDelivery: string | null;
  notes: string;
  shippingAddress: CustomerOrderAddress;
  billingAddress: CustomerOrderAddress;
  createdAt: string;
  updatedAt: string;
  uniqueId: string;
  __v: number;
}

export interface CustomerOrdersResponse {
  success: boolean;
  data: {
    orders: CustomerOrder[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export interface CustomerOrdersParams {
  page?: number;
  limit?: number;
  orderStatus?: string;
  paymentStatus?: string;
}

class CustomerOrderService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    console.log(`Making request to: ${API_CONFIG.baseURL}${endpoint}`);

    try {
      const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...API_CONFIG.headers,
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Customer Orders API Response:", data);
      return data;
    } catch (error) {
      console.error("Customer Orders API Request failed:", error);
      throw error;
    }
  }

  async getCustomerOrders(
    customerId: string,
    params: CustomerOrdersParams = {}
  ): Promise<CustomerOrdersResponse> {
    const searchParams = new URLSearchParams();

    // Set default values
    const defaultParams = {
      page: 1,
      limit: 10,
      ...params,
    };

    Object.entries(defaultParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/public/customer-orders/customer/${customerId}${
      queryString ? `?${queryString}` : ""
    }`;

    return this.request<CustomerOrdersResponse>(endpoint);
  }

  async getCustomerOrder(orderId: string): Promise<CustomerOrder> {
    const endpoint = `/public/customer-orders/details/${orderId}`;
    const response = await this.request<{
      success: boolean;
      data: CustomerOrder;
    }>(endpoint);
    return response.data;
  }
}

export const customerOrderService = new CustomerOrderService();
