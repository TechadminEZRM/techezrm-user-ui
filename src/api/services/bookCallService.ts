import axios from "axios";
import { API_CONFIG } from "../config";

export interface BookCallQueryRequest {
  name: string;
  email: string;
  mobile: string;
  mode: string;
  purpose: string;
  date:string;
  time:string;
}

export interface ContactQueryResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const submitDetailToBookACall = async (
  data: BookCallQueryRequest
): Promise<ContactQueryResponse> => {
  const response = await axios.post(
    `${API_CONFIG.baseURL}/public/callBooking`,
    data,
    {
      headers: API_CONFIG.headers,
    }
  );
  return response.data;
};
