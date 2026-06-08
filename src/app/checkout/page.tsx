"use client";
import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Home, Building2, Store, Globe, Tag } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import { customerProfileHandler } from "@/api/handlers/customerProfileHandler";
import { useCart } from "@/api/handlers/cartHandler";
import { checkoutSessionsService } from "@/api/services/checkoutSessions";
import type { CustomerProfile } from "@/api/services/customerProfile";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import AddressModal from "@/components/AddressModal";
import { useCustomerAddresses } from "@/hooks/use-customer-addresses";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "react-toastify";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  cardHolderName: string;
  cardNumber: string;
  cvv: string;
  expirationDate: string;
  addressLine1: string;
  city: string;
  state: string;
  landmark: string;
  postalCode: string;
}

const inputClass = "w-full border border-[#e0e0e0] rounded bg-white px-3 py-2 text-sm text-[#333] placeholder:text-[#999] focus:outline-none focus:border-[#F9A922] hover:border-[#ccc] transition-colors";

const paymentMethods = [
  { name: "Visa", src: "/visa2.png?height=25&width=44&text=VISA" },
  { name: "Stripe", src: "/stripe.png?height=24&width=40&text=stripe" },
  { name: "PayPal", src: "/pp.png?height=24&width=40&text=PayPal" },
  { name: "Mastercard", src: "/mastercard.png?height=24&width=40&text=MC" },
  { name: "Google Pay", src: "/gpay.png?height=24&width=40&text=GPay" },
];

const AddressTypeIcon: React.FC<{ type: string }> = ({ type }) => {
  const cls = "w-4 h-4 text-[#F9A922]";
  if (type === "home") return <Home className={cls} />;
  if (type === "work") return <Building2 className={cls} />;
  if (type === "warehouse") return <Store className={cls} />;
  return <Globe className={cls} />;
};

const CheckoutForm: React.FC = () => {
  const { customer } = useAppStore();
  const [formData, setFormData] = useState<FormData>({
    firstName: "", lastName: "", email: "", phoneNumber: "", cardHolderName: "",
    cardNumber: "", cvv: "", expirationDate: "", addressLine1: "", city: "", state: "", landmark: "", postalCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string>("");
  const [paymentSuccess, setPaymentSuccess] = useState<string>("");
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [orderId, setOrderId] = useState<string>("");
  const [discount, setDiscount] = useState("");
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const { addresses, defaultAddress, isLoading: addressesLoading, addAddress, refetch: refetchAddresses } = useCustomerAddresses(customer?.id);
  const { data: cartResponse, isLoading: cartLoading } = useCart(customer?.id || "", { enabled: !!customer?.id });
  const cartData = cartResponse?.data?.cart;
  const cartItems = cartData?.items || [];
  const subtotal = cartData?.totalAmount || 0;

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!customer?.id) return;
      setLoading(true); setError("");
      try {
        const profile = await customerProfileHandler.getProfile(customer.id);
        setCustomerProfile(profile);
        if (profile) {
          const nameParts = profile.name?.split(" ") || [];
          setFormData((p) => ({ ...p, firstName: nameParts[0] || "", lastName: nameParts.slice(1).join(" ") || "", email: profile.email || "", phoneNumber: profile.phone || "", cardHolderName: profile.name || "" }));
        }
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
          setFormData((p) => ({ ...p, addressLine1: defaultAddress.street || "", city: defaultAddress.city || "", state: defaultAddress.state || "", postalCode: defaultAddress.zipCode || "" }));
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setError("Failed to load customer information. Please fill the form manually.");
      } finally { setLoading(false); }
    };
    fetchCustomerData();
  }, [customer?.id]);

  useEffect(() => {
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!).then(setStripe);
  }, []);

  const handleInputChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [field]: event.target.value }));
  };

  const handleAddressSave = async (addressData: any) => {
    try { await addAddress(addressData); await refetchAddresses(); } catch (error) { console.error("Error saving address:", error); }
  };

  const handleCompletePurchase = async () => {
    if (!customer?.id) { toast.warning("Please log in to complete your purchase."); return; }
    if (!stripe) { toast.error("Payment system is not ready. Please try again."); return; }
    const requiredFields = { firstName: formData.firstName, lastName: formData.lastName, email: formData.email, addressLine1: formData.addressLine1, city: formData.city, state: formData.state };
    const missingFields = Object.entries(requiredFields).filter(([_, v]) => !v?.trim()).map(([field]) => ({ firstName: "First Name", lastName: "Last Name", email: "Email", addressLine1: "Address", city: "City", state: "State" }[field] || field));
    if (missingFields.length > 0) { toast.warning(`Please fill in the following required fields: ${missingFields.join(", ")}`); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { toast.warning("Please enter a valid email address."); return; }
    setPaymentProcessing(true); setPaymentError("");
    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setOrderId(orderId);
      const shipping = 5.99; const tax = subtotal * 0.08; const totalAmount = subtotal + shipping + tax;
      const selectedAddress = selectedAddressId ? addresses.find((a) => a._id === selectedAddressId) : null;
      const checkoutData = {
        customerId: customer.id, customerName: `${formData.firstName} ${formData.lastName}`, customerEmail: formData.email,
        shippingAddress: { addressLine1: formData.addressLine1, city: formData.city, state: formData.state, postalCode: formData.postalCode, country: "India" },
        billingAddress: selectedAddress ? { addressLine1: selectedAddress.street, city: selectedAddress.city, state: selectedAddress.state, postalCode: selectedAddress.zipCode, country: selectedAddress.country } : { addressLine1: formData.addressLine1, city: formData.city, state: formData.state, postalCode: formData.postalCode, country: "India" },
        orderItems: cartItems.map((item) => ({ productId: item.product._id, productName: item.productName || "Product", quantity: item.quantity, unitPrice: item.productPrice || 0, totalPrice: (item.productPrice || 0) * item.quantity })),
        subTotal: subtotal, tax, shippingCost: shipping, discount: 0, totalAmount, currency: "usd",
        lineItems: cartItems.map((item) => ({ price_data: { currency: "usd", product_data: { name: item.productName || "Product", description: `Product ID: ${item.product._id}`, images: ["/product.png"] }, unit_amount: Math.round((item.productPrice || 0) * 100) }, quantity: item.quantity })),
        mode: "payment" as "payment",
        successUrl: `${window.location.origin}/payment-success?orderId=${orderId}`,
        cancelUrl: `${window.location.origin}/checkout`,
      };
      const checkoutSession: any = await checkoutSessionsService.createCheckoutSession(checkoutData);
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId: checkoutSession?.data?.sessionId });
        if (error) throw new Error(error.message);
      } else throw new Error("Stripe is not initialized");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "Payment failed. Please try again.");
    } finally { setPaymentProcessing(false); }
  };

  const handleAddressSelect = (address: any) => {
    setSelectedAddressId(address._id);
    setFormData((p) => ({ ...p, addressLine1: address.street || "", city: address.city || "", state: address.state || "", postalCode: address.zipCode || "" }));
    console.log("use this address");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl md:text-2xl font-semibold text-[#333] mb-6">Complete your Order</h1>

      {loading && (
        <div className="flex items-center justify-center py-8 gap-3">
          <Spinner size="sm" className="border-[#F9A922] border-t-transparent" />
          <span className="text-[#666]">Loading your information...</span>
        </div>
      )}
      {error && <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-3 mb-6 text-sm">{error}</div>}
      {paymentError && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6 text-sm">{paymentError}</div>}
      {paymentSuccess && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-6 text-sm">{paymentSuccess}</div>}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left section */}
        <div className="flex-1">
          {/* Cart Items */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8 mb-8">
            <h2 className="text-[#1e293b] font-bold text-xl mb-6">Cart Items ({cartItems.length})</h2>
            {cartLoading ? (
              <div className="text-center py-8 flex flex-col items-center gap-2">
                <Spinner size="sm" className="border-[#F9A922] border-t-transparent" />
                <span className="text-[#666]">Loading cart items...</span>
              </div>
            ) : cartItems.length > 0 ? (
              <div className="max-h-[400px] overflow-y-auto flex flex-col gap-3">
                {cartItems.map((item, index) => (
                  <div key={index} className="p-4 rounded-[12px] border border-[rgba(255,107,53,0.1)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(255,107,53,0.1)] hover:-translate-y-px hover:border-[rgba(255,107,53,0.2)] transition-all bg-gradient-to-br from-white to-[#fafbfc]">
                    <div className="flex gap-4 items-center">
                      <div className="w-[60px] h-[60px] rounded-[10px] overflow-hidden flex-shrink-0 border-2 border-[rgba(255,107,53,0.1)] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                        <img src="/product.png" alt={item.productName || "Product"} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#1e293b] text-sm font-semibold mb-0.5 truncate">{item.productName || "Product"}</p>
                        <p className="text-[#64748b] text-xs mb-2 font-mono">ID: {item?.product?._id?.slice(-8) || "N/A"}</p>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-bold" style={{ background: "linear-gradient(135deg, #F9A922 0%, #E8981F 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            ${(item.productPrice || 0) * item.quantity}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#64748b] text-xs font-medium">Qty:</span>
                            <span className="bg-[rgba(255,107,53,0.1)] text-[#F9A922] px-2.5 py-1 rounded-[6px] text-xs font-semibold border border-[rgba(255,107,53,0.2)] min-w-[32px] text-center">{item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#64748b] text-center py-8">No items in cart</p>
            )}
          </div>

          {/* Address Management */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[#1e293b] font-bold text-xl">Shipping Address</h2>
              <button onClick={() => setAddressModalOpen(true)} className="bg-[#F9A922] hover:bg-[#E8981F] text-white text-sm font-semibold px-4 py-2 rounded transition-colors">
                Add New Address
              </button>
            </div>

            {!addressesLoading && addresses.length > 0 && (
              <div className="mb-8">
                <p className="text-[#64748b] font-semibold text-sm mb-3">Saved Addresses ({addresses.length})</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {addresses.map((address) => {
                    const isSelected = selectedAddressId === address._id;
                    const isDefault = address.isDefault;
                    return (
                      <div
                        key={address._id}
                        onClick={() => handleAddressSelect(address)}
                        className={`p-5 rounded-lg cursor-pointer relative transition-all hover:-translate-y-px ${isSelected ? "border-2 border-[#F9A922] bg-[rgba(255,107,53,0.08)]" : isDefault ? "border border-[#e0e0e0] bg-[rgba(255,107,53,0.03)]" : "border border-[#e0e0e0] bg-white"} hover:shadow-[0_4px_12px_rgba(255,107,53,0.15)] hover:border-[#F9A922]`}
                      >
                        {isDefault && <span className="absolute top-2 right-2 text-[0.65rem] font-bold bg-[#F9A922] text-white px-2 py-0.5 rounded-full">DEFAULT</span>}
                        {isSelected && <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-[#F9A922] flex items-center justify-center text-white text-[0.7rem] font-bold">✓</div>}
                        <div className={isDefault ? "pr-16" : ""}>
                          <div className="flex items-center gap-2 mb-3">
                            <AddressTypeIcon type={address.type} />
                            <span className={`text-xs font-bold uppercase tracking-wide ${isSelected ? "text-[#F9A922]" : "text-[#333]"}`}>{address.type} Address</span>
                          </div>
                          <div className="ml-6">
                            {address.companyName && <p className="text-xs font-semibold text-[#1e293b] mb-0.5">{address.companyName}</p>}
                            <p className="text-xs font-semibold text-[#1e293b] mb-0.5">{address.receiverName}</p>
                            <p className="text-xs text-[#64748b] leading-snug mb-0.5">{address.street}</p>
                            <p className="text-xs text-[#64748b] leading-snug mb-0.5">{address.city}, {address.state} {address.zipCode}</p>
                            <p className="text-xs text-[#64748b] leading-snug mb-0.5">{address.country}</p>
                            <p className="text-[0.7rem] text-[#94a3b8]">📞 {address.receiverPhone} • ✉️ {address.receiverEmail}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Personal Details */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8 mt-8">
            <p className="text-[#F9A922] font-semibold mb-6">Personal Details</p>
            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">First name</label>
                <input className={inputClass} style={{ width: "300px" }} placeholder="Enter Your First Name" value={formData.firstName} onChange={handleInputChange("firstName")} />
              </div>
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">Last name</label>
                <input className={inputClass} style={{ width: "300px" }} placeholder="Enter Your Last Name" value={formData.lastName} onChange={handleInputChange("lastName")} />
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">Email</label>
                <input type="email" className={inputClass} style={{ width: "300px" }} placeholder="Enter Your Email" value={formData.email} onChange={handleInputChange("email")} />
              </div>
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">Phone number</label>
                <input className={inputClass} style={{ width: "300px" }} placeholder="Enter Your Phone Number" value={formData.phoneNumber} onChange={handleInputChange("phoneNumber")} />
              </div>
            </div>
          </div>
        </div>

        {/* Right section — Order Summary */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="p-8 rounded-xl border border-[#475569] shadow-[0_8px_30px_rgba(0,0,0,0.15)] sticky top-6" style={{ background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)" }}>
            <h2 className="text-white font-bold text-xl text-center mb-6">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-[18px] h-[18px] text-[#10b981]" />
                <span className="text-[#e2e8f0] font-semibold text-sm">Apply Coupon</span>
              </div>
              <input
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none focus:border-[#F9A922] transition-colors"
                placeholder="Enter coupon code"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
              <button className="mt-3 bg-[#10b981] hover:bg-[#059669] text-white text-sm font-semibold px-4 py-1.5 rounded transition-colors">
                Apply Coupon
              </button>
            </div>

            {/* Price rows */}
            {[["Subtotal", `$${subtotal.toFixed(2)}`, "white"], ["Shipping", "$5.99", "white"], ["Tax", `$${(subtotal * 0.08).toFixed(2)}`, "white"], ["Discount", "-$0.00", "#10b981"]].map(([label, value, color]) => (
              <div key={label} className="flex justify-between items-center mb-4">
                <span className="text-[#cbd5e1] text-sm font-medium">{label}</span>
                <span className="font-bold text-[1.1rem]" style={{ color }}>{value}</span>
              </div>
            ))}
            <hr className="border-white/20 my-6" />
            <div className="flex justify-between items-center mb-8">
              <span className="text-white text-[1.2rem] font-bold">Total</span>
              <span className="text-[#F9A922] text-[1.4rem] font-extrabold">${(subtotal + 5.99 + subtotal * 0.08).toFixed(2)}</span>
            </div>

            {/* Trust */}
            <p className="text-[#94a3b8] text-xs text-center mb-3">🔒 Secure Payment • 🚚 Fast Delivery • 💯 Quality Guarantee</p>

            {/* Payment methods */}
            <p className="text-[#94a3b8] text-xs text-center mb-3">Accepted Payment Methods</p>
            <div className="flex justify-center gap-2 flex-wrap mb-6">
              {paymentMethods.map((m) => (
                <div key={m.name} className="w-10 h-6 rounded overflow-hidden border border-white/20">
                  <img src={m.src} alt={m.name} className="w-full h-full object-contain bg-white" />
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleCompletePurchase}
              disabled={loading || paymentProcessing}
              className="w-full bg-[#F9A922] hover:bg-[#E8981F] disabled:bg-[#ccc] text-white py-4 text-base font-bold rounded-lg shadow-[0_8px_25px_rgba(255,107,53,0.3)] hover:shadow-[0_12px_35px_rgba(255,107,53,0.4)] flex items-center justify-center gap-2 transition-all"
            >
              {(loading || paymentProcessing) && <Spinner size="sm" className="border-white border-t-transparent" />}
              {loading ? "Loading..." : paymentProcessing ? "Creating Checkout Session..." : "Proceed to Checkout"}
            </button>
          </div>
        </div>
      </div>

      <AddressModal open={addressModalOpen} onClose={() => setAddressModalOpen(false)} onSave={handleAddressSave} customerId={customer?.id} />
    </div>
  );
};

export default CheckoutForm;
