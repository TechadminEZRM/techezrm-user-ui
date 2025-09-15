"use client";

import { useQuery } from "@tanstack/react-query";
import { customerOrderService, type CustomerOrdersParams } from "../services/";

export const useCustomerOrders = (customerId: string, params?: any) => {
  return useQuery({
    queryKey: ["customer-orders", customerId, params],
    queryFn: () => customerOrderService.getCustomerOrders(customerId, params),
    enabled: !!customerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    retryDelay: 1000,
  });
};

export const useCustomerOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["customer-orders", "detail", orderId],
    queryFn: () => customerOrderService.getCustomerOrder(orderId),
    enabled: !!orderId,
    retry: 2,
    retryDelay: 1000,
  });
};
