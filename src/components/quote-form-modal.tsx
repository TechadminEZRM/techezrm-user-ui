"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useSubmitRFQ } from "../api/handlers/rfqHandler";
import type { RFQRequest } from "../api/services/rfq";

interface QuoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  productId?: string;
}

interface FormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerPhoneCountryCode: string;
  productName: string;
  quantity: number;
  companyWebsiteLink: string;
  department: string;
  companyType: string;
  monthlyVolume: string;
  timeline: string;
  availabilityDay: string;
  availabilityTime: string;
}

const fieldClass = "flex h-[45px] w-full rounded-[6px] border border-[#e0e0e0] bg-white px-3.5 py-3 text-sm text-[#1F2A44] placeholder:text-[#999] focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]";
const selectClass = "flex h-[45px] w-full rounded-[6px] border border-[#e0e0e0] bg-white px-3.5 text-sm text-[#333] focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] appearance-none";

const QuoteFormModal: React.FC<QuoteFormModalProps> = ({ isOpen, onClose, productName = "", productId = "" }) => {
  const submitRFQMutation = useSubmitRFQ();
  const defaultForm: FormData = {
    customerName: "", customerEmail: "", customerPhone: "", customerPhoneCountryCode: "+1",
    productName: productName || "Organic Mucuna pruriens Powder", quantity: 1,
    companyWebsiteLink: "", department: "", companyType: "", monthlyVolume: "",
    timeline: "", availabilityDay: "", availabilityTime: "",
  };

  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (productName) setFormData((p) => ({ ...p, productName }));
  }, [productName]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.customerName.trim()) newErrors.customerName = "Customer name is required";
    if (!formData.customerEmail.trim()) newErrors.customerEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) newErrors.customerEmail = "Please enter a valid email address";
    if (!formData.customerPhone.trim()) newErrors.customerPhone = "Phone number is required";
    if (!formData.productName.trim()) newErrors.productName = "Product name is required";
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = "Valid quantity is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.monthlyVolume) newErrors.monthlyVolume = "Monthly volume is required";
    if (!formData.timeline) newErrors.timeline = "Timeline is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mapToRFQ = (data: FormData): RFQRequest => {
    const urgency = (t: string): "low" | "medium" | "high" => {
      if (t === "immediate" || t === "1-week") return "high";
      if (t === "1-month") return "medium";
      return "low";
    };
    return {
      customerName: data.customerName, customerEmail: data.customerEmail,
      customerPhone: data.customerPhone, customerPhoneCountryCode: data.customerPhoneCountryCode,
      productId: productId || undefined, productName: data.productName, quantity: data.quantity,
      description: `Monthly Volume: ${data.monthlyVolume}${data.companyType ? `, Company Type: ${data.companyType}` : ""}`,
      urgency: urgency(data.timeline), status: "pending",
      companyWebsiteLink: data.companyWebsiteLink || undefined,
      department: data.department, availabilityDay: data.availabilityDay || undefined,
      availabilityTime: data.availabilityTime || undefined,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await submitRFQMutation.mutateAsync(mapToRFQ(formData));
      setFormData({ ...defaultForm, productName: productName || "Organic Mucuna pruriens Powder" });
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); onClose(); }, 3000);
    } catch (err) {
      console.error("Failed to submit RFQ:", err);
    }
  };

  const handleClose = () => { setShowSuccess(false); setErrors({}); onClose(); };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px] p-0 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="font-semibold text-[#333] text-lg">Tell Us Your Requirement</h2>
          <button onClick={handleClose} className="text-[#999] hover:text-[#666] hover:bg-[#f5f5f5] rounded-full p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {showSuccess && (
          <div className="mx-6 mb-4 bg-green-50 text-green-700 p-3 rounded-md border border-green-200 text-sm">
            Your quote request has been submitted successfully! We will get back to you soon.
          </div>
        )}
        {submitRFQMutation.isError && (
          <div className="mx-6 mb-4 bg-red-50 text-red-700 p-3 rounded-md border border-red-200 text-sm">
            Failed to submit quote request. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 pb-6 flex flex-col gap-4">
          {/* Customer Name */}
          <div>
            <label className="text-sm font-medium text-[#333] mb-2 block"><span className="text-red-500">*</span> Customer Name</label>
            <input value={formData.customerName} onChange={(e) => handleInputChange("customerName", e.target.value)} className={fieldClass} />
            {errors.customerName && <p className="text-red-600 text-xs mt-1">{errors.customerName}</p>}
          </div>

          {/* Product */}
          <div>
            <label className="text-sm font-medium text-[#333] mb-2 block"><span className="text-red-500">*</span> Enter Product</label>
            <input value={formData.productName} onChange={(e) => handleInputChange("productName", e.target.value)} className={fieldClass} />
            {errors.productName && <p className="text-red-600 text-xs mt-1">{errors.productName}</p>}
          </div>

          {/* Quantity + Website */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-[#333] mb-2 block"><span className="text-red-500">*</span> Pack Quantity</label>
              <input type="number" value={formData.quantity} onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 1)} className={fieldClass} />
              {errors.quantity && <p className="text-red-600 text-xs mt-1">{errors.quantity}</p>}
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-[#333] mb-2 block">Company Website Link</label>
              <input placeholder="Ex. www.example.com" value={formData.companyWebsiteLink} onChange={(e) => handleInputChange("companyWebsiteLink", e.target.value)} className={fieldClass} />
            </div>
          </div>

          {/* Email + Mobile */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-[#333] mb-2 block"><span className="text-red-500">*</span> Email</label>
              <input type="email" placeholder="Ex. user@example.com" value={formData.customerEmail} onChange={(e) => handleInputChange("customerEmail", e.target.value)} className={fieldClass} />
              {errors.customerEmail && <p className="text-red-600 text-xs mt-1">{errors.customerEmail}</p>}
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-[#333] mb-2 block"><span className="text-red-500">*</span> Mobile</label>
              <div className="flex gap-2">
                <select value={formData.customerPhoneCountryCode} onChange={(e) => handleInputChange("customerPhoneCountryCode", e.target.value)} className={`${selectClass} w-[90px] flex-shrink-0`}>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+91">🇮🇳 +91</option>
                </select>
                <input placeholder="345446645" value={formData.customerPhone} onChange={(e) => handleInputChange("customerPhone", e.target.value)} className={`${fieldClass} flex-1`} />
              </div>
              {errors.customerPhone && <p className="text-red-600 text-xs mt-1">{errors.customerPhone}</p>}
            </div>
          </div>

          {/* Department + Company Type */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-[#333] mb-2 block"><span className="text-red-500">*</span> Department</label>
              <select value={formData.department} onChange={(e) => handleInputChange("department", e.target.value)} className={selectClass}>
                <option value="">Please Select a Department</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="procurement">Procurement</option>
                <option value="operations">Operations</option>
              </select>
              {errors.department && <p className="text-red-600 text-xs mt-1">{errors.department}</p>}
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-[#333] mb-2 block">Company Type</label>
              <select value={formData.companyType} onChange={(e) => handleInputChange("companyType", e.target.value)} className={selectClass}>
                <option value="">Please Select a Type</option>
                <option value="manufacturer">Manufacturer</option>
                <option value="distributor">Distributor</option>
                <option value="retailer">Retailer</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Monthly Volume + Timeline */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-[#333] mb-2 block"><span className="text-red-500">*</span> Monthly Volume</label>
              <select value={formData.monthlyVolume} onChange={(e) => handleInputChange("monthlyVolume", e.target.value)} className={selectClass}>
                <option value="">Please Select a Volume</option>
                <option value="1-10">1-10 units</option>
                <option value="11-50">11-50 units</option>
                <option value="51-100">51-100 units</option>
                <option value="100+">100+ units</option>
              </select>
              {errors.monthlyVolume && <p className="text-red-600 text-xs mt-1">{errors.monthlyVolume}</p>}
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-[#333] mb-2 block"><span className="text-red-500">*</span> Timeline</label>
              <select value={formData.timeline} onChange={(e) => handleInputChange("timeline", e.target.value)} className={selectClass}>
                <option value="">Please Select a Timeline</option>
                <option value="immediate">Immediate</option>
                <option value="1-week">Within 1 week</option>
                <option value="1-month">Within 1 month</option>
                <option value="3-months">Within 3 months</option>
              </select>
              {errors.timeline && <p className="text-red-600 text-xs mt-1">{errors.timeline}</p>}
            </div>
          </div>

          {/* Availability */}
          <div>
            <p className="text-sm font-medium text-[#333] mb-3">Would you be available for a call at your earliest convenience?</p>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-[#333] mb-2 block">Day</label>
                <select value={formData.availabilityDay} onChange={(e) => handleInputChange("availabilityDay", e.target.value)} className={selectClass}>
                  <option value="">Please Select a Day</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="this-week">This Week</option>
                  <option value="next-week">Next Week</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-[#333] mb-2 block">Time (Timezone-EST)</label>
                <select value={formData.availabilityTime} onChange={(e) => handleInputChange("availabilityTime", e.target.value)} className={selectClass}>
                  <option value="">Please Select time</option>
                  <option value="9-10">9:00 AM - 10:00 AM</option>
                  <option value="10-11">10:00 AM - 11:00 AM</option>
                  <option value="11-12">11:00 AM - 12:00 PM</option>
                  <option value="2-3">2:00 PM - 3:00 PM</option>
                  <option value="3-4">3:00 PM - 4:00 PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitRFQMutation.isPending}
            className="w-full h-12 bg-[#F05A25] text-white text-base font-medium rounded-[6px] hover:bg-[#689F38] disabled:bg-[#ccc] disabled:text-[#666] transition-colors flex items-center justify-center gap-2"
          >
            {submitRFQMutation.isPending ? <><Spinner size="sm" className="border-white border-t-transparent" /> Submitting...</> : "Place an Enquiry"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteFormModal;
