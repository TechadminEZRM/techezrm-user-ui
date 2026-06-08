"use client";

import type React from "react";
import { useState } from "react";
import { Wallet, Package, ArrowRight } from "lucide-react";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAppStore } from "@/store/use-app-store";
import { useCustomerOrders } from "@/api/handlers";
import type { CustomerOrder } from "@/api/services";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

interface OrderCardProps {
  order: CustomerOrder;
  onViewDetails: () => void;
  onBuyAgain?: () => void;
}

const statusBadgeClasses: Record<string, { bg: string; text: string; border: string }> = {
  success: { bg: "#e8f5e8", text: "#2e7d32", border: "#c8e6c9" },
  error: { bg: "#ffeaea", text: "#d32f2f", border: "#ffcdd2" },
  info: { bg: "#e3f2fd", text: "#1976d2", border: "#bbdefb" },
  warning: { bg: "#fff3e0", text: "#f57c00", border: "#ffcc02" },
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onBuyAgain }) => {
  const router = useRouter();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const getStatusText = (orderStatus: string, _paymentStatus: string) => {
    if (orderStatus === "delivered") return "Order Delivered";
    if (orderStatus === "cancelled") return "Order Cancelled";
    if (orderStatus === "shipped") return "Order Shipped";
    if (orderStatus === "processing") return "Order Processing";
    if (orderStatus === "confirmed") return "Order Confirmed";
    return "Order In Progress";
  };

  const getStatusBadges = (orderStatus: string, paymentStatus: string) => {
    const badges: Array<{ label: string; color: "success" | "error" | "info" | "warning" }> = [];
    if (orderStatus === "delivered") badges.push({ label: "Delivered", color: "success" });
    else if (orderStatus === "cancelled") badges.push({ label: "Cancelled", color: "error" });
    else if (orderStatus === "shipped") badges.push({ label: "Shipped", color: "info" });
    else if (orderStatus === "processing") badges.push({ label: "Processing", color: "info" });
    else if (orderStatus === "confirmed") badges.push({ label: "Confirmed", color: "info" });
    else badges.push({ label: "Pending", color: "warning" });

    if (paymentStatus === "pending") badges.push({ label: "Payment Pending", color: "warning" });
    else if (paymentStatus === "processing") badges.push({ label: "Payment Processing", color: "info" });
    else if (paymentStatus === "failed") badges.push({ label: "Payment Failed", color: "error" });
    else if (paymentStatus === "completed") badges.push({ label: "Paid", color: "success" });
    else if (paymentStatus === "refunded") badges.push({ label: "Refunded", color: "warning" });
    return badges;
  };

  const formatPaymentMethod = (method: string) => {
    switch (method.toLowerCase()) {
      case "cod": return "Cash on Delivery";
      case "upi": return "UPI Payment";
      case "card": case "credit_card": return "Credit Card";
      case "netbanking": return "Net Banking";
      default: return method.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };

  const statusBadges = getStatusBadges(order.orderStatus, order.paymentStatus);
  const canBuyAgain = order.orderStatus === "delivered";

  return (
    <div className="bg-white rounded-[12px] p-6 mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#f0f0f0]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-base font-semibold text-[#333] mb-1">{getStatusText(order.orderStatus, order.paymentStatus)}</p>
          <p className="text-sm text-[#666]">{formatDate(order.createdAt)}</p>
          <p className="text-xs text-[#999] mt-1">Order ID: {order.uniqueId}</p>
        </div>
        <button
          onClick={() => router.push(`/orderDetails?orderId=${order.uniqueId}`)}
          className="flex items-center gap-1 text-[#333] text-sm font-medium hover:underline"
        >
          View Order Details <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Payment Info */}
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-[#666]" />
          <div>
            <p className="text-base font-semibold text-[#333]">${order.totalAmount.toLocaleString()}</p>
            <p className="text-xs text-[#666]">{formatPaymentMethod(order.paymentMethod)}</p>
          </div>
        </div>

        {/* Items Info */}
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-[#666]" />
          <div>
            <p className="text-base font-semibold text-[#333]">Items</p>
            <p className="text-xs text-[#666]">{order.items.reduce((t, i) => t + i.quantity, 0)}x</p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex gap-2 flex-wrap">
          {statusBadges.map((badge, index) => {
            const cls = statusBadgeClasses[badge.color] || statusBadgeClasses.warning;
            return (
              <span
                key={index}
                className="text-xs font-medium h-7 px-3 flex items-center rounded-full border"
                style={{ backgroundColor: cls.bg, color: cls.text, borderColor: cls.border }}
              >
                {badge.label}
              </span>
            );
          })}
          {canBuyAgain && onBuyAgain && (
            <button
              onClick={onBuyAgain}
              className="text-xs font-medium h-7 px-3 rounded-full border hover:bg-[#ffe0b2] transition-colors"
              style={{ backgroundColor: "#fff3e0", color: "#f57c00", borderColor: "#ffcc02" }}
            >
              Buy Again
            </button>
          )}
        </div>
      </div>

      {/* Product Images */}
      <div className="flex items-center gap-2 mt-6 flex-wrap bg-[#FAF8F9] rounded-[18px]">
        {order.items.slice(0, 6).map((item, index) => (
          <div key={index} className="w-10 h-10 rounded-[8px] overflow-hidden bg-white flex items-center justify-center m-2 p-2">
            <Image src="/orange.png" alt={`Product ${index + 1}`} width={40} height={40} style={{ objectFit: "cover", borderRadius: "8px" }} />
          </div>
        ))}
        {order.items.length > 6 && (
          <div className="w-10 h-10 rounded-[8px] bg-[#f0f0f0] flex items-center justify-center m-2">
            <span className="text-xs font-semibold text-[#666]">+{order.items.length - 6}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const OrdersPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState(0);
  const { customer } = useAppStore();

  const getOrderStatusFilter = () => {
    switch (activeTab) {
      case 1: return "pending";
      case 2: return "delivered";
      case 3: return "cancelled";
      default: return undefined;
    }
  };

  const { data: response, isLoading, error, isError } = useCustomerOrders(customer?.id || "", {
    orderStatus: getOrderStatusFilter(),
    limit: 20,
    activeTab: activeTab,
  });

  const orders = response?.data?.orders || [];
  const counts = response?.data?.totalCountTabWise;

  const tabs = [
    `All Orders (${counts?.total || 0})`,
    `In Progress (${(counts?.pending || 0) + (counts?.processing || 0) + (counts?.shipped || 0)})`,
    `Delivered (${counts?.delivered || 0})`,
    `Cancelled (${counts?.cancelled || 0})`,
  ];

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" className="border-[#F9A922] border-t-transparent mx-auto mb-4" />
            <p className="text-[#666]">Loading your orders...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (isError) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6 max-w-[500px]">
            <p className="font-semibold text-base mb-1">Error loading orders</p>
            <p className="text-sm">{error instanceof Error ? error.message : "Something went wrong"}</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f8f9fa]">
        {/* Tabs */}
        <div className="bg-white border-b border-[#e0e0e0]">
          <div className="flex px-6 overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`text-sm font-medium py-4 mr-8 flex-shrink-0 border-b-[3px] transition-colors ${activeTab === index ? "text-[#F9A922] border-[#F9A922] font-semibold" : "text-[#666] border-transparent hover:text-[#F9A922]"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-[1200px] mx-auto">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-[#666] mb-2">No orders found</p>
              <p className="text-sm text-[#999]">
                {activeTab === 0 ? "You haven't placed any orders yet." : "No orders found for the selected filter."}
              </p>
            </div>
          ) : (
            orders.map((order: CustomerOrder) => (
              <OrderCard
                key={order._id}
                order={order}
                onViewDetails={() => console.log("View details for order", order._id)}
                onBuyAgain={() => console.log("Buy again for order", order._id)}
              />
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrdersPage;
