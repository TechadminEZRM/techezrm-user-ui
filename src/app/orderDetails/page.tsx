"use client";

import React from "react";
import { Truck, Receipt, User, Mail, Phone, MapPin, DollarSign, Package, FileText, Calendar, CreditCard, ShoppingCart, HeadphonesIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";
import TrackingModal from "@/components/TrackingModal";
import InvoiceModal from "@/components/InvoiceModal";
import ContactSupportModal from "@/components/ContactSupportModal";
import { useQuery } from "@tanstack/react-query";
import { customerOrderService } from "@/api/services/customerOrders";
import { formatDate } from "@/utils/dateUtils";
import { Spinner } from "@/components/ui/spinner";

// Inject keyframes once
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes pulse{0%{transform:scale(1);opacity:1}50%{transform:scale(1.2);opacity:0.7}100%{transform:scale(1);opacity:1}}
    @media print{body *{visibility:hidden}.invoice-print,.invoice-print *{visibility:visible}.invoice-print{position:absolute;left:0;top:0;width:210mm!important;height:297mm!important;margin:0!important;padding:0!important;box-shadow:none!important;border-radius:0!important;overflow:visible!important}.no-print{display:none!important}}
  `;
  document.head.appendChild(style);
}

const trackingPoints = [
  { lat: 31.2304, lng: 121.4737, icon: "🚢", label: "Shanghai Port", status: "completed" as const },
  { lat: 25.2048, lng: 55.2708, icon: "🏗️", label: "Dubai Port", status: "current" as const },
  { lat: 40.6892, lng: -74.0445, icon: "🏭", label: "New York Port", status: "pending" as const },
];

const trackingData = [
  { id: 1, location: "Shanghai Port, China", coordinates: [121.4737, 31.2304] as [number, number], status: "completed" as const, timestamp: "2025-01-15T08:00:00Z", description: "Package departed from origin port", icon: "🚢" },
  { id: 2, location: "East China Sea", coordinates: [122.0, 31.5] as [number, number], status: "completed" as const, timestamp: "2025-01-16T12:30:00Z", description: "In transit across East China Sea", icon: "🌊" },
  { id: 3, location: "Dubai Port, UAE", coordinates: [55.2708, 25.2048] as [number, number], status: "completed" as const, timestamp: "2025-01-18T14:45:00Z", description: "Arrived at Dubai port for transshipment", icon: "🏗️" },
  { id: 4, location: "Arabian Sea", coordinates: [65.0, 20.0] as [number, number], status: "completed" as const, timestamp: "2025-01-19T09:15:00Z", description: "Crossing Arabian Sea", icon: "🌊" },
  { id: 5, location: "Indian Ocean", coordinates: [70.0, 15.0] as [number, number], status: "completed" as const, timestamp: "2025-01-21T16:20:00Z", description: "Transiting through Indian Ocean", icon: "🌊" },
  { id: 6, location: "Red Sea", coordinates: [40.0, 25.0] as [number, number], status: "completed" as const, timestamp: "2025-01-23T11:30:00Z", description: "Passing through Red Sea", icon: "🌊" },
  { id: 7, location: "Suez Canal", coordinates: [32.5599, 30.0444] as [number, number], status: "completed" as const, timestamp: "2025-01-24T08:45:00Z", description: "Transiting Suez Canal", icon: "🚢" },
  { id: 8, location: "Mediterranean Sea", coordinates: [30.0, 35.0] as [number, number], status: "completed" as const, timestamp: "2025-01-25T13:15:00Z", description: "Crossing Mediterranean Sea", icon: "🌊" },
  { id: 9, location: "Atlantic Ocean", coordinates: [-20.0, 40.0] as [number, number], status: "completed" as const, timestamp: "2025-01-27T07:30:00Z", description: "Crossing Atlantic Ocean", icon: "🌊" },
  { id: 10, location: "New York Port, USA", coordinates: [-74.006, 40.7128] as [number, number], status: "current" as const, timestamp: "2025-01-29T15:00:00Z", description: "Arrived at destination port", icon: "🏭" },
  { id: 11, location: "Customs Clearance", coordinates: [-74.006, 40.7128] as [number, number], status: "pending" as const, timestamp: "2025-01-30T10:00:00Z", description: "Pending customs clearance", icon: "📋" },
  { id: 12, location: "Local Distribution Center", coordinates: [-74.006, 40.7128] as [number, number], status: "pending" as const, timestamp: "2025-02-01T14:00:00Z", description: "En route to local distribution center", icon: "🏪" },
];

const statusColorMap: Record<string, { bg: string; text: string; border: string }> = {
  delivered: { bg: "var(--color-success-light)", text: "var(--color-success)", border: "var(--color-success-light)" },
  shipped: { bg: "var(--color-info-light)", text: "var(--color-info)", border: "var(--color-info-light)" },
  processing: { bg: "var(--color-brand-light)", text: "var(--color-warn)", border: "var(--color-warn)" },
  confirmed: { bg: "var(--color-info-light)", text: "var(--color-info)", border: "var(--color-info-light)" },
  cancelled: { bg: "var(--color-danger-light)", text: "var(--color-danger)", border: "var(--color-danger-light)" },
  completed: { bg: "var(--color-success-light)", text: "var(--color-success)", border: "var(--color-success-light)" },
  failed: { bg: "var(--color-danger-light)", text: "var(--color-danger)", border: "var(--color-danger-light)" },
  refunded: { bg: "var(--color-info-light)", text: "var(--color-info)", border: "var(--color-info-light)" },
  pending: { bg: "var(--color-brand-light)", text: "var(--color-warn)", border: "var(--color-warn)" },
};

function StatusBadge({ label }: { label: string }) {
  const cls = statusColorMap[label.toLowerCase()] || { bg: "var(--color-paper)", text: "var(--color-dim)", border: "var(--color-line-light)" };
  return (
    <span className="text-xs font-medium h-6 px-3 inline-flex items-center rounded-full border" style={{ backgroundColor: cls.bg, color: cls.text, borderColor: cls.border }}>
      {label.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
    </span>
  );
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[8px] border border-line mb-6">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-wash">
        {icon}
        <h2 className="text-base font-semibold text-body">{title}</h2>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}

const OrdersDetail: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, customer } = useAppStore();
  const orderId = searchParams.get("orderId");
  const [isTrackingModalOpen, setIsTrackingModalOpen] = React.useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = React.useState(false);
  const [isContactSupportModalOpen, setIsContactSupportModalOpen] = React.useState(false);

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order-details", orderId],
    queryFn: () => customerOrderService.getCustomerOrder(orderId!),
    enabled: !!orderId && !!isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  React.useEffect(() => {
    if (!isAuthenticated || !customer) router.push("/sign_in");
  }, [isAuthenticated, customer, router]);

  if (!isAuthenticated || !customer) {
    return <div className="flex items-center justify-center min-h-screen bg-paper"><p>Redirecting to login...</p></div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <Spinner size="lg" className="border-brand border-t-transparent" />
        <p className="text-dim">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          {error ? "Failed to load order details" : "Order not found"}
        </div>
        <button onClick={() => router.push("/my_orders")} className="bg-brand hover:bg-brand-hover text-white px-6 py-2 rounded font-semibold transition-colors">Back to My Orders</button>
      </div>
    );
  }

  const formatPaymentMethod = (method: string) => {
    switch (method.toLowerCase()) {
      case "cod": return "Cash on Delivery";
      case "upi": return "UPI Payment";
      case "credit_card": return "Credit Card";
      case "netbanking": return "Net Banking";
      default: return method.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };

  const isCustomerObject = (c: any): c is { name: string; email: string; phone: string } =>
    c && typeof c === "object" && c.name;

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const getOrderStatusProgress = (status: string) => {
    const m: Record<string, number> = { pending: 0, confirmed: 0, processing: 1, shipped: 2, delivered: 3, cancelled: 0 };
    return m[status] || 0;
  };

  const statusSteps = ["confirmed", "processing", "shipped", "delivered"];
  const currentProgress = getOrderStatusProgress(order.orderStatus);

  return (
    <div className="bg-surface min-h-screen py-6">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.push("/my_orders")} className="border border-brand text-brand hover:bg-[rgba(255,107,53,0.04)] px-4 py-2 rounded text-sm font-medium transition-colors">
            ← Back to Orders
          </button>
          <h1 className="text-xl font-semibold text-body">Order Details</h1>
        </div>

        {/* Order Header Card */}
        <div className="bg-white rounded-[8px] border border-line mb-6">
          <div className="flex items-center justify-between px-6 py-4 border-b border-wash flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Receipt className="w-7 h-7 text-brand" />
              <div>
                <p className="text-base font-bold text-heading">Order #{order.uniqueId}</p>
                <p className="text-sm text-dim">Placed on {formatDate(order.createdAt)}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <StatusBadge label={order.orderStatus} />
              <span className="text-xs font-medium h-6 px-3 inline-flex items-center rounded-full border border-info-light bg-info-light text-info">Payment {order.paymentStatus}</span>
            </div>
          </div>
          <div className="px-6 py-4 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-brand">📍</span>
                <p className="text-sm font-semibold text-body">Tracking Number</p>
              </div>
              <button onClick={() => setIsTrackingModalOpen(true)} className="text-info hover:text-brand-hover underline font-mono text-sm transition-colors">
                {order.trackingNumber || "Not Available"}
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-brand" />
                <p className="text-sm font-semibold text-body">Estimated Delivery</p>
              </div>
              <p className="text-sm">{formatDate(order.estimatedDelivery)}</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        {isCustomerObject(order.customer) && (
          <InfoCard icon={<User className="w-6 h-6 text-brand" />} title="Customer Information">
            <div className="flex flex-col md:flex-row gap-6">
              {[
                { icon: <User className="w-5 h-5 text-brand" />, label: "Name", val: order.customer.name },
                { icon: <Mail className="w-5 h-5 text-brand" />, label: "Email", val: order.customer.email },
                { icon: <Phone className="w-5 h-5 text-brand" />, label: "Phone", val: order.customer.phone },
              ].map(({ icon, label, val }) => (
                <div key={label} className="flex-1">
                  <div className="flex items-center gap-2 mb-1">{icon}<span className="text-sm font-semibold">{label}</span></div>
                  <p className="text-sm text-body">{val}</p>
                </div>
              ))}
            </div>
          </InfoCard>
        )}

        {/* Order Status Tracking */}
        <InfoCard icon={<Truck className="w-6 h-6 text-brand" />} title="Order Status Tracking">
          <div className="relative py-4">
            {/* Progress line */}
            <div className="absolute top-[22px] left-[12.5%] h-[2px] bg-line-light z-0" style={{ width: "75%" }} />
            <div
              className="absolute top-[22px] left-[12.5%] h-[2px] bg-brand z-[1] transition-all"
              style={{ width: `calc(75% * ${Math.max(0, currentProgress) / 3})` }}
            />
            <div className="flex">
              {statusSteps.map((status, index) => {
                const isActive = index === currentProgress;
                const isCompleted = index < currentProgress;
                return (
                  <div key={status} className="flex-1 text-center relative z-[2]">
                    <div
                      className="w-3 h-3 rounded-full mx-auto mb-2"
                      style={{
                        backgroundColor: isActive || isCompleted ? "var(--color-brand)" : "var(--color-line-light)",
                        border: isActive ? "2px solid #fff" : "none",
                        boxShadow: isActive ? "0 0 0 2px var(--color-brand)" : "none",
                      }}
                    />
                    <p className={`text-xs font-medium ${isActive ? "text-brand" : isCompleted ? "text-[#667085]" : "text-line-light"}`}>
                      {status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                    <p className="text-[11px] text-[rgba(102,112,133,1)]">{formatDate(order.createdAt)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </InfoCard>

        {/* Order Items */}
        <InfoCard icon={<ShoppingCart className="w-6 h-6 text-brand" />} title="Order Items">
          {order.items.map((item, index) => (
            <div key={item._id}>
              <div className={`flex items-center p-4 bg-paper rounded mb-${index < order.items.length - 1 ? "4" : "0"}`}>
                <div className="w-[60px] h-[60px] rounded bg-brand flex items-center justify-center text-white text-xl font-bold mr-4 flex-shrink-0">P</div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-body">Product Item</p>
                  <p className="text-sm text-dim">Quantity: {item.quantity} × {formatCurrency(item.price)}</p>
                  {item.discount > 0 && <p className="text-sm text-green-600">Discount: {formatCurrency(item.discount)}</p>}
                </div>
                <p className="text-lg font-bold text-info">{formatCurrency(item.total)}</p>
              </div>
              {index < order.items.length - 1 && <hr className="border-wash my-2" />}
            </div>
          ))}
        </InfoCard>

        {/* Order Notes */}
        {order.notes && (
          <InfoCard icon={<FileText className="w-6 h-6 text-brand" />} title="Order Notes">
            <p className="text-sm italic text-body">{order.notes}</p>
          </InfoCard>
        )}

        {/* Addresses */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {[
            { icon: <Truck />, title: "Shipping Address", addr: order.shippingAddress, label: "Delivery Address" },
            { icon: <Receipt />, title: "Billing Address", addr: order.billingAddress, label: "Invoice Address" },
          ].map(({ icon, title, addr, label }) => (
            <div key={title} className="flex-1 bg-white rounded-[8px] border border-line">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-wash">
                <span className="text-brand w-6 h-6">{icon}</span>
                <h2 className="text-base font-semibold text-body">{title}</h2>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center gap-2 mb-2"><MapPin className="w-5 h-5 text-brand" /><span className="text-sm font-semibold">{label}</span></div>
                <p className="text-sm text-body">{addr.street}</p>
                <p className="text-sm text-body">{addr.city}, {addr.state}</p>
                <p className="text-sm text-body">{addr.country} - {addr.zipCode}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment + Summary */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <InfoCard icon={<CreditCard className="w-6 h-6 text-brand" />} title="Payment Information">
            <div className="flex items-center gap-2 mb-2"><DollarSign className="w-5 h-5 text-brand" /><span className="text-sm font-semibold">Payment Method</span></div>
            <p className="text-sm mb-4">{formatPaymentMethod(order.paymentMethod)}</p>
            <div className="flex items-center gap-2"><span className="text-sm font-semibold">Payment Status:</span><StatusBadge label={order.paymentStatus} /></div>
          </InfoCard>
          <InfoCard icon={<DollarSign className="w-6 h-6 text-brand" />} title="Order Summary">
            {[["Subtotal", formatCurrency(order.subTotal), ""], order.discount > 0 ? ["Discount", `- ${formatCurrency(order.discount)}`, "text-green-600"] : null, ["Shipping Cost", formatCurrency(order.shippingCost), ""], ["Tax", formatCurrency(order.tax), ""]].filter(Boolean).map((row) => {
              const [label, val, cls] = row as string[];
              return (
                <div key={label} className="flex justify-between py-1"><span className="text-sm text-dim">{label}</span><span className={`text-sm ${cls || "text-body"}`}>{val}</span></div>
              );
            })}
            <hr className="my-3 border-wash" />
            <div className="flex justify-between"><span className="text-base font-semibold text-body">Total Amount</span><span className="text-xl font-bold text-info">{formatCurrency(order.totalAmount)}</span></div>
          </InfoCard>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <button onClick={() => setIsInvoiceModalOpen(true)} className="flex items-center gap-2 border border-line-light text-[#424242] font-semibold px-6 py-3 rounded-[8px] hover:border-line-light hover:bg-black/5 transition-colors">
            <Receipt className="w-4 h-4" /> Download Invoice
          </button>
          <button onClick={() => setIsContactSupportModalOpen(true)} className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white font-semibold px-6 py-3 rounded-[8px] transition-colors">
            <HeadphonesIcon className="w-4 h-4" /> Contact Support
          </button>
        </div>
      </div>

      <TrackingModal open={isTrackingModalOpen} onClose={() => setIsTrackingModalOpen(false)} trackingNumber={order?.trackingNumber} trackingData={trackingData} trackingPoints={trackingPoints} />
      <InvoiceModal open={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} order={order} />
      <ContactSupportModal open={isContactSupportModalOpen} onClose={() => setIsContactSupportModalOpen(false)} />
    </div>
  );
};

export default OrdersDetail;
