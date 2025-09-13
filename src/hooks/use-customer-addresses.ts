import { useState, useEffect } from "react";
import {
  customerAddressService,
  CustomerAddress,
} from "@/api/services/customerAddress";

interface UseCustomerAddressesReturn {
  addresses: CustomerAddress[];
  defaultAddress: CustomerAddress | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addAddress: (addressData: any) => Promise<CustomerAddress | null>;
  updateAddress: (
    addressId: string,
    addressData: any
  ) => Promise<CustomerAddress | null>;
  deleteAddress: (addressId: string) => Promise<boolean>;
  updateDefaultAddress: (addressId: string) => Promise<boolean>;
}

export const useCustomerAddresses = (
  customerId?: string
): UseCustomerAddressesReturn => {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<CustomerAddress | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
    if (!customerId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await customerAddressService.getAddresses(customerId);
      if (response.success) {
        setAddresses(response.data);
        const defaultAddr = response.data.find((addr) => addr.isDefault);
        setDefaultAddress(defaultAddr || null);
      } else {
        setError("Failed to fetch addresses");
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch addresses"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = async (
    addressData: any
  ): Promise<CustomerAddress | null> => {
    if (!customerId) return null;

    try {
      const response = await customerAddressService.addAddress(
        customerId,
        addressData
      );
      if (response.success) {
        await fetchAddresses(); // Refresh the list
        return response.data;
      }
      return null;
    } catch (err) {
      console.error("Error adding address:", err);
      throw err;
    }
  };

  const updateAddress = async (
    addressId: string,
    addressData: any
  ): Promise<CustomerAddress | null> => {
    if (!customerId) return null;

    try {
      const response = await customerAddressService.updateAddress(
        customerId,
        addressId,
        addressData
      );
      if (response.success) {
        await fetchAddresses(); // Refresh the list
        return response.data;
      }
      return null;
    } catch (err) {
      console.error("Error updating address:", err);
      throw err;
    }
  };

  const deleteAddress = async (addressId: string): Promise<boolean> => {
    if (!customerId) return false;

    try {
      const response = await customerAddressService.deleteAddress(
        customerId,
        addressId
      );
      if (response.success) {
        await fetchAddresses(); // Refresh the list
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error deleting address:", err);
      throw err;
    }
  };

  const updateDefaultAddress = async (addressId: string): Promise<boolean> => {
    if (!customerId) return false;

    try {
      const response = await customerAddressService.setDefaultAddress(
        customerId,
        addressId
      );
      if (response.success) {
        await fetchAddresses(); // Refresh the list
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error setting default address:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchAddresses();
    }
  }, [customerId]);

  return {
    addresses,
    defaultAddress,
    isLoading,
    error,
    refetch: fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    updateDefaultAddress,
  };
};
