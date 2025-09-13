import { API_CONFIG, ENDPOINTS } from "../config";

export interface CustomerAddress {
  _id: string;
  uniqueId: string;
  customerId: string;
  companyName: string;
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  receiverPhoneCountryCode: string;
  type: "home" | "work" | "other" | "warehouse";
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  isActive: boolean;
  coordinates: {
    latitude: string;
    longitude: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AddAddressRequest {
  companyName: string;
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  receiverPhoneCountryCode: string;
  type: "home" | "work" | "other" | "warehouse";
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault?: boolean;
  coordinates?: {
    latitude: string;
    longitude: string;
  };
}

export interface UpdateAddressRequest extends Partial<AddAddressRequest> {}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface CustomerAddressResponse extends ApiResponse {
  data: CustomerAddress[];
}

export interface CustomerAddressDetailResponse extends ApiResponse {
  data: CustomerAddress;
}

class CustomerAddressService {
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

  /**
   * Get all addresses for a customer
   */
  async getAddresses(customerId: string): Promise<CustomerAddressResponse> {
    return this.makeRequest<CustomerAddressResponse>(
      ENDPOINTS.CUSTOMER_ADDRESS.LIST(customerId),
      {
        method: "GET",
      }
    );
  }

  /**
   * Get address detail
   */
  async getAddressDetail(
    customerId: string,
    addressId: string
  ): Promise<CustomerAddressDetailResponse> {
    return this.makeRequest<CustomerAddressDetailResponse>(
      ENDPOINTS.CUSTOMER_ADDRESS.DETAIL(customerId, addressId),
      {
        method: "GET",
      }
    );
  }

  /**
   * Add new address
   */
  async addAddress(
    customerId: string,
    addressData: AddAddressRequest
  ): Promise<CustomerAddressDetailResponse> {
    return this.makeRequest<CustomerAddressDetailResponse>(
      ENDPOINTS.CUSTOMER_ADDRESS.ADD(customerId),
      {
        method: "POST",
        body: JSON.stringify(addressData),
      }
    );
  }

  /**
   * Update address
   */
  async updateAddress(
    customerId: string,
    addressId: string,
    addressData: UpdateAddressRequest
  ): Promise<CustomerAddressDetailResponse> {
    return this.makeRequest<CustomerAddressDetailResponse>(
      ENDPOINTS.CUSTOMER_ADDRESS.UPDATE(customerId, addressId),
      {
        method: "PUT",
        body: JSON.stringify(addressData),
      }
    );
  }

  /**
   * Delete address
   */
  async deleteAddress(
    customerId: string,
    addressId: string
  ): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>(
      ENDPOINTS.CUSTOMER_ADDRESS.DELETE(customerId, addressId),
      {
        method: "DELETE",
      }
    );
  }

  /**
   * Set default address
   */
  async setDefaultAddress(
    customerId: string,
    addressId: string
  ): Promise<CustomerAddressDetailResponse> {
    return this.makeRequest<CustomerAddressDetailResponse>(
      ENDPOINTS.CUSTOMER_ADDRESS.SET_DEFAULT(customerId, addressId),
      {
        method: "PATCH",
      }
    );
  }
}

export const customerAddressService = new CustomerAddressService();

export type {
  CustomerAddress as Address,
  AddAddressRequest,
  UpdateAddressRequest,
  CustomerAddressResponse,
  CustomerAddressDetailResponse,
};
