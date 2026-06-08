import { ENDPOINTS } from "../config/endpoints";

export interface ProductVariant {
  _id: string;
  productId: string;
  price: number;
  unit: string;
  unitSize: number;
  uniqueId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProductVariantsResponse {
  success: boolean;
  data: ProductVariant[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

import axios from "axios";
import { API_CONFIG } from "../config";

export const productVariantsService = {
  getProductVariants: async (
    productId: string
  ): Promise<ProductVariantsResponse> => {
    const response = await axios.get<ProductVariantsResponse>(
      `${API_CONFIG.baseURL}${ENDPOINTS.PRODUCTS.VARIANTS(productId)}`
    );
    return response.data;
  },
};
