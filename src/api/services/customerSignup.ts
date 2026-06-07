/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_CONFIG, ENDPOINTS } from "../config"

export interface InitiateSignupRequest {
  email: string,
  name: string,
  phone: string,
  connectBy?: string, // Optional field to track how the user found out about the service
}

export interface InitiateSignupResponse {
  success: boolean
  message: string
  data?: any
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface VerifyOtpResponse {
  success: boolean
  message: string
  data?: any
}

export interface CompleteSignupRequest {
  email: string
  name: string
  phone: string
  organizationName: string
  address: string
  industry: string
  website: string
  employeeCount: number
  annualRevenue: string
  businessType: string
  taxId: string
  registrationNumber: string
  contactPerson: string
  contactPersonPhone: string
  contactPersonEmail: string
  notes: string
}

export interface CompleteSignupResponse {
  success: boolean
  message: string
  data?: any
}

class CustomerSignupService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    console.log(`Making request to: ${API_CONFIG.baseURL}${endpoint}`)

    try {
      const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...API_CONFIG.headers,
          ...options?.headers,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Customer Signup API Response:", data)
      return data
    } catch (error) {
      console.error("Customer Signup API Request failed:", error)
      throw error
    }
  }

  async initiateSignup(request: InitiateSignupRequest): Promise<InitiateSignupResponse> {
    const endpoint = ENDPOINTS.CUSTOMER_SIGNUP.INITIATE

    return this.request<InitiateSignupResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  async verifyOtp(request: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const endpoint = ENDPOINTS.CUSTOMER_SIGNUP.VERIFY_OTP

    return this.request<VerifyOtpResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  async completeSignup(request: CompleteSignupRequest): Promise<CompleteSignupResponse> {
    const endpoint = ENDPOINTS.CUSTOMER_SIGNUP.COMPLETE

    return this.request<CompleteSignupResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify(request),
    })
  }
}

export const customerSignupService = new CustomerSignupService()
