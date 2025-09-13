import { API_CONFIG, ENDPOINTS } from "../config";

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    inStock: boolean;
    status: string;
  };
  productName: string;
  productPrice: number;
  quantity: number;
  packOption: string;
  packQuantity: number;
  specifications?: string;
  notes?: string;
}

export interface Cart {
  _id: string;
  customer: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  status: "active" | "saved" | "abandoned" | "checked_out";
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    customer: string;
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
    itemCount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
    __v: number;
    cart: Cart;
  };
}

export interface CartSummaryResponse {
  success: boolean;
  message: string;
  data: {
    totalItems: number;
    totalAmount: number;
    itemCount: number;
  };
}

export interface AddToCartRequest {
  customerId: string;
  productId: string;
  quantity: number;
  packOption?: string;
  packQuantity?: number;
  packPrice?: number;
  specifications?: string;
  notes?: string;
}

export interface UpdateCartItemRequest {
  customerId: string;
  quantity?: number;
  packOption?: string;
  currentPackOption?: string;
  packQuantity?: number;
  packPrice?: number;
  specifications?: string;
  notes?: string;
}

class CartService {
  private async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("customer_token")
        : null;

    const response = await fetch(`${API_CONFIG.baseURL}${url}`, {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  async getCart(customerId: string): Promise<CartResponse> {
    const url = `${ENDPOINTS.CART.GET}?customerId=${encodeURIComponent(
      customerId
    )}`;
    return this.makeRequest<CartResponse>(url, {
      method: "GET",
    });
  }

  async getCartSummary(customerId: string): Promise<CartSummaryResponse> {
    const url = `${ENDPOINTS.CART.SUMMARY}?customerId=${encodeURIComponent(
      customerId
    )}`;
    return this.makeRequest<CartSummaryResponse>(url, {
      method: "GET",
    });
  }

  async addToCart(data: AddToCartRequest): Promise<CartResponse> {
    return this.makeRequest<CartResponse>(ENDPOINTS.CART.ADD, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCartItem(
    productId: string,
    data: UpdateCartItemRequest
  ): Promise<CartResponse> {
    return this.makeRequest<CartResponse>(ENDPOINTS.CART.UPDATE(productId), {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async removeFromCart(
    customerId: string,
    productId: string,
    packOption?: string
  ): Promise<CartResponse> {
    return this.makeRequest<CartResponse>(ENDPOINTS.CART.REMOVE(productId), {
      method: "DELETE",
      body: JSON.stringify({
        customerId,
        ...(packOption && { packOption }),
      }),
    });
  }

  async clearCart(customerId: string): Promise<CartResponse> {
    const url = `${ENDPOINTS.CART.CLEAR}?customerId=${encodeURIComponent(
      customerId
    )}`;
    return this.makeRequest<CartResponse>(url, {
      method: "DELETE",
    });
  }

  async validateCart(customerId: string): Promise<CartResponse> {
    return this.makeRequest<CartResponse>(ENDPOINTS.CART.VALIDATE, {
      method: "POST",
      body: JSON.stringify({ customerId }),
    });
  }
}

export const cartService = new CartService();
