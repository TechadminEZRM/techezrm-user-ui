"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Home, ShoppingBag, Download, Receipt, Truck, CreditCard, User, Mail, Phone, MapPin } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";
import { useClearCart } from "@/api/handlers/cartHandler";
import axios from "axios";
import { API_CONFIG } from "@/api/config";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import OrderReceiptPDF from "@/components/OrderReceiptPDF";
import { Spinner } from "@/components/ui/spinner";

interface OrderDetails {
  _id: string;
  uniqueId: string;
  customer: { _id: string; name: string; email: string; phone?: string };
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  subTotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  shippingAddress: { street: string; city?: string; state?: string; postalCode?: string; country?: string };
  billingAddress: { street: string; city?: string; state?: string; postalCode?: string; country?: string };
  items: Array<{ product: { _id: string; name: string; description?: string }; quantity: number; price: number }>;
  createdAt: string;
  updatedAt: string;
}

function InfoPanel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[8px] border border-[#e9ecef] mb-6">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-[#f0f0f0]">
        <span className="text-[#F9A922]">{icon}</span>
        <p className="text-base font-semibold text-[#333]">{title}</p>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}

const PaymentSuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { customer } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string>("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { mutate: clearCart } = useClearCart();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const customerOrderId = searchParams.get("customerOrderId");
        if (!customerOrderId) { setError("Order ID not found in URL"); setLoading(false); return; }
        const response = await axios.get(`${API_CONFIG.baseURL}/public/customer-orders/details/ObjectId/${customerOrderId}`);
        if (response?.data?.success) {
          setOrderDetails(response.data.data);
          if (customer?.id) {
            try { clearCart(customer.id); } catch (cartError) { console.error("Error clearing cart:", cartError); toast.error("Failed to clear cart"); }
          }
        } else { setError("Failed to fetch order details"); }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to load order details");
      } finally { setLoading(false); }
    };
    fetchOrderDetails();
  }, [searchParams, customer?.id, clearCart]);

  const handleDownloadPDF = async () => {
    if (!orderDetails) { toast.error("Unable to generate PDF"); return; }
    setIsGeneratingPDF(true);
    try {
      const tempContainer = document.createElement("div");
      Object.assign(tempContainer.style, { position: "absolute", left: "-9999px", top: "-9999px", width: "800px", backgroundColor: "white", padding: "20px", fontFamily: "Arial, sans-serif" });
      document.body.appendChild(tempContainer);
      const { createRoot } = await import("react-dom/client");
      const root = createRoot(tempContainer);
      root.render(<OrderReceiptPDF orderDetails={orderDetails} />);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const canvas = await html2canvas(tempContainer, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: "#ffffff", logging: false, width: tempContainer.scrollWidth, height: tempContainer.scrollHeight, scrollX: 0, scrollY: 0 });
      const imgData = canvas.toDataURL("image/png", 1.0);
      const imgWidth = 210; const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF("p", "mm", "a4");
      let heightLeft = imgHeight; let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) { position = heightLeft - imgHeight; pdf.addPage(); pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight); heightLeft -= pageHeight; }
      root.unmount();
      document.body.removeChild(tempContainer);
      pdf.save(`order-receipt-${orderDetails?.uniqueId || "receipt"}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally { setIsGeneratingPDF(false); }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <Spinner size="md" className="border-[#F9A922] border-t-transparent" />
          <p className="text-[#666] text-sm">Processing your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-[8px] p-4">{error}</div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-[8px] p-4">Order details not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Success Header */}
      <div className="bg-[#f8f9fa] border border-[#e9ecef] rounded-[8px] p-8 text-center mb-6">
        <CheckCircle2 className="w-16 h-16 text-[#28a745] mx-auto mb-4" />
        <p className="text-2xl font-semibold text-[#333] mb-2">Payment Successful</p>
        <p className="text-base text-[#666]">Order #{orderDetails?.uniqueId || "N/A"}</p>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1">
          {/* Order Summary */}
          <InfoPanel icon={<Receipt className="w-5 h-5" />} title="Order Summary">
            {[["Subtotal", `$${(orderDetails?.subTotal || 0).toFixed(2)}`, ""], ["Tax", `$${(orderDetails?.tax || 0).toFixed(2)}`, ""], ["Shipping", `$${(orderDetails?.shippingCost || 0).toFixed(2)}`, ""]].map(([l, v]) => (
              <div key={l} className="flex justify-between mb-3"><p className="text-sm text-[#666]">{l}</p><p className="text-sm text-[#333]">{v}</p></div>
            ))}
            {(orderDetails?.discount || 0) > 0 && (
              <div className="flex justify-between mb-3"><p className="text-sm text-[#666]">Discount</p><p className="text-sm text-[#28a745]">-${(orderDetails?.discount || 0).toFixed(2)}</p></div>
            )}
            <hr className="my-4 border-[#f0f0f0]" />
            <div className="flex justify-between">
              <p className="text-lg font-semibold text-[#333]">Total</p>
              <p className="text-lg font-semibold text-[#F9A922]">${(orderDetails?.totalAmount || 0).toFixed(2)}</p>
            </div>
          </InfoPanel>

          {/* Customer Details */}
          <InfoPanel icon={<User className="w-5 h-5" />} title="Customer Details">
            <p className="text-sm font-medium text-[#333] mb-2">{orderDetails?.customer?.name || "N/A"}</p>
            <div className="flex items-center gap-2 mb-2"><Mail className="w-4 h-4 text-[#666]" /><p className="text-sm text-[#666]">{orderDetails?.customer?.email || "N/A"}</p></div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#666]" /><p className="text-sm text-[#666]">{orderDetails?.customer?.phone || "N/A"}</p></div>
          </InfoPanel>

          {/* Order Status */}
          <InfoPanel icon={<CreditCard className="w-5 h-5" />} title="Order Status">
            <div className="flex gap-3 flex-wrap">
              <span className="text-sm px-3 py-1 rounded-full bg-[#e3f2fd] text-[#1976d2]">{orderDetails?.orderStatus || "Unknown"}</span>
              <span className="text-sm px-3 py-1 rounded-full bg-[#e8f5e8] text-[#2e7d32]">{orderDetails?.paymentStatus || "Unknown"}</span>
              <span className="text-sm px-3 py-1 rounded-full bg-[#fff3e0] text-[#f57c00]">{orderDetails?.paymentMethod || "Unknown"}</span>
            </div>
          </InfoPanel>
        </div>

        {/* Right Column */}
        <div className="flex-1">
          {/* Shipping Address */}
          <InfoPanel icon={<MapPin className="w-5 h-5" />} title="Shipping Address">
            <p className="text-sm text-[#666] leading-relaxed">
              {orderDetails?.shippingAddress?.street || "N/A"}
              {orderDetails?.shippingAddress?.city && <><br />{orderDetails.shippingAddress.city}{orderDetails?.shippingAddress?.state && `, ${orderDetails.shippingAddress.state}`}{orderDetails?.shippingAddress?.postalCode && ` ${orderDetails.shippingAddress.postalCode}`}</>}
              {orderDetails?.shippingAddress?.country && <><br />{orderDetails.shippingAddress.country}</>}
            </p>
          </InfoPanel>

          {/* Order Items */}
          <InfoPanel icon={<Truck className="w-5 h-5" />} title="Order Items">
            {orderDetails?.items?.map((item, index) => (
              <div key={index} className="flex justify-between items-start mb-4 p-4 bg-[#f8f9fa] rounded">
                <div className="flex-1">
                  <p className="text-sm text-[#333] font-medium mb-1">{item?.product?.name || "N/A"}</p>
                  <p className="text-xs text-[#666]">Qty: {item?.quantity || 0} × ${((item?.price || 0) / (item?.quantity || 1)).toFixed(2)}</p>
                </div>
                <p className="text-sm text-[#333] font-medium ml-4">${(item?.price || 0).toFixed(2)}</p>
              </div>
            )) || <p className="text-sm text-[#666]">No items found</p>}
          </InfoPanel>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-4 mt-4">
        <button onClick={() => router.push("/")} className="flex-1 flex items-center justify-center gap-2 border border-[#ddd] text-[#666] hover:border-[#ccc] hover:bg-[#f9f9f9] py-3 text-sm font-medium rounded transition-colors">
          <Home className="w-4 h-4" /> Continue Shopping
        </button>
        <button onClick={() => router.push("/profile?page=orders")} className="flex-1 flex items-center justify-center gap-2 bg-[#F9A922] hover:bg-[#E8981F] text-white py-3 text-sm font-medium rounded transition-colors">
          <ShoppingBag className="w-4 h-4" /> View Orders
        </button>
      </div>
      <button
        onClick={handleDownloadPDF}
        disabled={isGeneratingPDF}
        className="w-full flex items-center justify-center gap-2 border border-[#F9A922] text-[#F9A922] hover:bg-[rgba(255,107,53,0.04)] disabled:border-[#ccc] disabled:text-[#999] py-3 text-sm font-medium rounded transition-colors"
      >
        {isGeneratingPDF ? <><Spinner size="sm" /> Generating PDF...</> : <><Download className="w-4 h-4" /> Download Order Receipt</>}
      </button>
    </div>
  );
};

export default PaymentSuccessPage;
