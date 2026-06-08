import React from "react";
import { CheckCircle2, Receipt, Truck, CreditCard, User, Mail, Phone, MapPin } from "lucide-react";

interface OrderDetails {
  _id: string;
  uniqueId: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  subTotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  shippingAddress: {
    street: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  billingAddress: {
    street: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      description?: string;
    };
    quantity: number;
    price: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface OrderReceiptPDFProps {
  orderDetails: OrderDetails | null;
}

const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; bg?: boolean }> = ({ icon, title, children, bg }) => (
  <div className={`p-4 rounded-lg mb-4 shadow-sm border border-[#e9ecef] ${bg ? "bg-[#f8f9fa]" : "bg-white"}`}>
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[#F9A922]">{icon}</span>
      <span className="text-base font-semibold text-[#333]">{title}</span>
    </div>
    {children}
  </div>
);

const Row: React.FC<{ label: string; value: React.ReactNode; green?: boolean; accent?: boolean }> = ({ label, value, green, accent }) => (
  <div className="flex justify-between items-center mb-2">
    <span className="text-sm text-[#666]">{label}</span>
    <span className={`text-sm ${green ? "text-[#28a745]" : accent ? "text-[#F9A922] font-semibold" : "text-[#333]"}`}>{value}</span>
  </div>
);

const OrderReceiptPDF: React.FC<OrderReceiptPDFProps> = ({ orderDetails }) => {
  if (!orderDetails) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <p className="text-sm text-[#666]">No order details available</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#F9A922] mb-1">EZRM</h1>
        <h2 className="text-lg text-[#333] mb-4">Order Receipt</h2>
        <CheckCircle2 className="w-10 h-10 text-[#28a745] mx-auto mb-2" />
        <p className="text-[1.1rem] font-semibold text-[#333] mb-1">Payment Successful</p>
        <p className="text-sm text-[#666]">Order #{orderDetails?.uniqueId || "N/A"}</p>
        <p className="text-xs text-[#666]">Date: {orderDetails?.createdAt ? new Date(orderDetails.createdAt).toLocaleDateString() : "N/A"}</p>
      </div>

      {/* Order Summary */}
      <Section icon={<Receipt className="w-5 h-5" />} title="Order Summary" bg>
        <Row label="Subtotal" value={`$${(orderDetails?.subTotal || 0).toFixed(2)}`} />
        <Row label="Tax" value={`$${(orderDetails?.tax || 0).toFixed(2)}`} />
        <Row label="Shipping" value={`$${(orderDetails?.shippingCost || 0).toFixed(2)}`} />
        {(orderDetails?.discount || 0) > 0 && (
          <Row label="Discount" value={`-$${(orderDetails?.discount || 0).toFixed(2)}`} green />
        )}
        <hr className="border-[#e9ecef] my-3" />
        <Row label="Total" value={`$${(orderDetails?.totalAmount || 0).toFixed(2)}`} accent />
      </Section>

      {/* Customer Details */}
      <Section icon={<User className="w-5 h-5" />} title="Customer Details">
        <p className="text-sm font-medium text-[#333] mb-2">{orderDetails?.customer?.name || "N/A"}</p>
        <div className="flex items-center gap-2 mb-1">
          <Mail className="w-3.5 h-3.5 text-[#666]" />
          <span className="text-xs text-[#666]">{orderDetails?.customer?.email || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-[#666]" />
          <span className="text-xs text-[#666]">{orderDetails?.customer?.phone || "N/A"}</span>
        </div>
      </Section>

      {/* Shipping Address */}
      <Section icon={<MapPin className="w-5 h-5" />} title="Shipping Address">
        <p className="text-sm text-[#666] leading-snug">
          {orderDetails?.shippingAddress?.street || "N/A"}
          {orderDetails?.shippingAddress?.city && (
            <><br />{orderDetails.shippingAddress.city}{orderDetails?.shippingAddress?.state && `, ${orderDetails.shippingAddress.state}`}{orderDetails?.shippingAddress?.postalCode && ` ${orderDetails.shippingAddress.postalCode}`}</>
          )}
          {orderDetails?.shippingAddress?.country && <><br />{orderDetails.shippingAddress.country}</>}
        </p>
      </Section>

      {/* Order Items */}
      <Section icon={<Truck className="w-5 h-5" />} title="Order Items">
        {orderDetails?.items?.map((item, index) => (
          <div key={index} className="flex justify-between items-start mb-3 p-3 bg-[#f8f9fa] rounded">
            <div>
              <p className="text-sm font-medium text-[#333]">{item?.product?.name || "N/A"}</p>
              <p className="text-xs text-[#666]">Qty: {item?.quantity || 0} × ${((item?.price || 0) / (item?.quantity || 1)).toFixed(2)}</p>
            </div>
            <p className="text-sm font-medium text-[#333]">${(item?.price || 0).toFixed(2)}</p>
          </div>
        )) || <p className="text-sm text-[#666]">No items found</p>}
      </Section>

      {/* Order Status */}
      <Section icon={<CreditCard className="w-5 h-5" />} title="Order Status">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#666]">Order Status:</span>
            <span className="text-xs font-medium text-[#1976d2]">{orderDetails?.orderStatus || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#666]">Payment Status:</span>
            <span className="text-xs font-medium text-[#2e7d32]">{orderDetails?.paymentStatus || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#666]">Payment Method:</span>
            <span className="text-xs font-medium text-[#f57c00]">{orderDetails?.paymentMethod || "Unknown"}</span>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <div className="text-center mt-8 pt-6 border-t border-[#e9ecef]">
        <p className="text-xs text-[#666]">Thank you for your order!</p>
        <p className="text-[0.7rem] text-[#999] mt-1">EZRM - Your trusted partner for quality products</p>
      </div>
    </div>
  );
};

export default OrderReceiptPDF;
