"use client";

import type React from "react";
import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useSubmitRFQ } from "@/api/handlers";

interface RFQModalProps {
  open: boolean;
  onClose: () => void;
  productId?: string;
  productName?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const inputClass = "flex h-8 w-full border-0 border-b border-[#e0e0e0] bg-transparent px-0 py-1.5 text-sm text-[#333] placeholder:text-[#999] focus:outline-none focus:border-[#333] transition-colors";
const selectClass = "flex h-8 w-full border-0 border-b border-[#e0e0e0] bg-transparent px-0 py-1.5 text-sm text-[#333] focus:outline-none focus:border-[#333] appearance-none transition-colors";

const countryCodeOptions = [
  { value: "+1", label: "🇺🇸 +1" }, { value: "+44", label: "🇬🇧 +44" }, { value: "+91", label: "🇮🇳 +91" },
  { value: "+86", label: "🇨🇳 +86" }, { value: "+81", label: "🇯🇵 +81" }, { value: "+49", label: "🇩🇪 +49" },
  { value: "+33", label: "🇫🇷 +33" }, { value: "+39", label: "🇮🇹 +39" }, { value: "+34", label: "🇪🇸 +34" },
  { value: "+31", label: "🇳🇱 +31" },
];

const RFQModal: React.FC<RFQModalProps> = ({ open, onClose, productId, productName = "", onSuccess, onError }) => {
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);
  const defaultForm = {
    customerName: "", customerEmail: "", customerPhone: "", customerPhoneCountryCode: "+1",
    productName: productName, quantity: 1, description: "", urgency: "medium" as "low" | "medium" | "high",
    department: "", companyType: "", monthlyVolume: "", timeline: "", availabilityDay: "",
    availabilityTime: "", companyWebsiteLink: "", additionalRequirements: "", expectedDeliveryDate: "", budget: "",
  };
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submitRFQMutation = useSubmitRFQ();

  const handleInputChange = (field: string, value: any) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const formatPhoneNumber = (v: string) => v.replace(/\D/g, "").slice(0, 10);

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!formData.customerName.trim()) e.customerName = "Customer name is required";
    if (!formData.customerEmail.trim()) e.customerEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) e.customerEmail = "Please enter a valid email address";
    if (!formData.customerPhone.trim()) e.customerPhone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(formData.customerPhone.replace(/\D/g, ""))) e.customerPhone = "Please enter a valid 10-digit phone number";
    if (!formData.productName.trim()) e.productName = "Product name is required";
    if (!formData.quantity || formData.quantity <= 0) e.quantity = "Quantity must be greater than 0";
    if (!formData.description.trim()) e.description = "Description is required";
    if (!formData.department) e.department = "Department is required";
    if (!formData.monthlyVolume) e.monthlyVolume = "Monthly volume is required";
    if (!formData.timeline) e.timeline = "Timeline is required";
    if (!formData.expectedDeliveryDate) e.expectedDeliveryDate = "Expected delivery date is required";
    if (!formData.budget) e.budget = "Budget range is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await submitRFQMutation.mutateAsync({ ...formData, productId, status: "pending" });
      if (response.success) {
        setResponseData(response.data);
        setSuccessModalOpen(true);
        onSuccess?.();
      } else {
        onError?.(response.message || "Failed to submit RFQ");
      }
    } catch {
      onError?.("Failed to submit RFQ. Please try again.");
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalOpen(false);
    setFormData({ ...defaultForm, productName });
    setErrors({});
    onClose();
  };

  const FieldLabel = ({ req, children }: { req?: boolean; children: React.ReactNode }) => (
    <p className="text-sm font-medium text-[#333] mb-2">{req && <span className="text-red-600">*</span>} {children}</p>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 rounded-none border border-[#e0e0e0] shadow-none">
        {/* Header */}
        <div
          className="flex justify-between items-center p-6 border-b border-[#e0e0e0]"
          style={{ background: "linear-gradient(135deg, rgba(245,138,78,1) 0%, rgba(241,106,60,1) 100%)" }}
        >
          <div>
            <h2 className="text-2xl font-semibold text-white">Request for Quotation</h2>
            <p className="text-white/90 text-sm mt-1">Get a customized quote for your requirements</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/10 rounded-full p-1.5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 bg-[#fafafa] overflow-y-auto max-h-[80vh]">
          {submitRFQMutation.isError && (
            <div className="bg-red-50 text-red-700 p-3 rounded mb-6 text-sm border border-red-200">Failed to submit RFQ. Please try again.</div>
          )}
          {submitRFQMutation.isSuccess && (
            <div className="bg-green-50 text-green-700 p-3 rounded mb-6 text-sm border border-green-200">RFQ submitted successfully! We'll get back to you soon.</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <FieldLabel req>Customer Name</FieldLabel>
                <input className={inputClass} placeholder="Enter your full name" value={formData.customerName} onChange={(e) => handleInputChange("customerName", e.target.value)} />
                {errors.customerName && <p className="text-red-600 text-xs mt-1">{errors.customerName}</p>}
              </div>
              <div>
                <FieldLabel req>Email</FieldLabel>
                <input type="email" className={inputClass} placeholder="Enter your email" value={formData.customerEmail} onChange={(e) => handleInputChange("customerEmail", e.target.value)} />
                {errors.customerEmail && <p className="text-red-600 text-xs mt-1">{errors.customerEmail}</p>}
              </div>
              <div>
                <FieldLabel req>Enter Product</FieldLabel>
                <input className={inputClass} placeholder="Enter product name" value={formData.productName} onChange={(e) => handleInputChange("productName", e.target.value)} />
                {errors.productName && <p className="text-red-600 text-xs mt-1">{errors.productName}</p>}
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <FieldLabel req>Mobile Country Code</FieldLabel>
                <select className={selectClass} value={formData.customerPhoneCountryCode} onChange={(e) => handleInputChange("customerPhoneCountryCode", e.target.value)}>
                  {countryCodeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel req>Mobile Number</FieldLabel>
                <input className={inputClass} placeholder="345446645" value={formData.customerPhone} onChange={(e) => handleInputChange("customerPhone", formatPhoneNumber(e.target.value))} />
                {errors.customerPhone && <p className="text-red-600 text-xs mt-1">{errors.customerPhone}</p>}
              </div>
              <div>
                <FieldLabel req>Pack Quantity</FieldLabel>
                <input type="number" min={1} className={inputClass} value={formData.quantity} onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 1)} />
                {errors.quantity && <p className="text-red-600 text-xs mt-1">{errors.quantity}</p>}
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <FieldLabel req>Budget Range</FieldLabel>
                <input className={inputClass} placeholder="Ex: $1000 - $5000" value={formData.budget} onChange={(e) => handleInputChange("budget", e.target.value)} />
                {errors.budget && <p className="text-red-600 text-xs mt-1">{errors.budget}</p>}
              </div>
              <div>
                <FieldLabel>Company Website Link</FieldLabel>
                <input className={inputClass} placeholder="Ex: www.example.com" value={formData.companyWebsiteLink} onChange={(e) => handleInputChange("companyWebsiteLink", e.target.value)} />
              </div>
              <div>
                <FieldLabel req>Expected Delivery Date</FieldLabel>
                <input type="date" className={inputClass} value={formData.expectedDeliveryDate} onChange={(e) => handleInputChange("expectedDeliveryDate", e.target.value)} />
                {errors.expectedDeliveryDate && <p className="text-red-600 text-xs mt-1">{errors.expectedDeliveryDate}</p>}
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <FieldLabel req>Department</FieldLabel>
                <select className={selectClass} value={formData.department} onChange={(e) => handleInputChange("department", e.target.value)}>
                  <option value="">Select</option>
                  {["R&D","Production","Quality Control","Procurement","Sales","Marketing","Other"].map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.department && <p className="text-red-600 text-xs mt-1">{errors.department}</p>}
              </div>
              <div>
                <FieldLabel>Company Type</FieldLabel>
                <select className={selectClass} value={formData.companyType} onChange={(e) => handleInputChange("companyType", e.target.value)}>
                  <option value="">Select</option>
                  {["Manufacturer","Distributor","Retailer","Research Institute","University","Other"].map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel req>Monthly Volume</FieldLabel>
                <select className={selectClass} value={formData.monthlyVolume} onChange={(e) => handleInputChange("monthlyVolume", e.target.value)}>
                  <option value="">Please Select a Volume</option>
                  {["1-10kg","10-50kg","50-100kg","100-500kg","500kg+"].map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.monthlyVolume && <p className="text-red-600 text-xs mt-1">{errors.monthlyVolume}</p>}
              </div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <FieldLabel req>Timeline</FieldLabel>
                <select className={selectClass} value={formData.timeline} onChange={(e) => handleInputChange("timeline", e.target.value)}>
                  <option value="">Please Select a Timeline</option>
                  {["1-2 weeks","2-4 weeks","1-2 months","2-3 months","3+ months"].map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.timeline && <p className="text-red-600 text-xs mt-1">{errors.timeline}</p>}
              </div>
              <div>
                <FieldLabel>Urgency</FieldLabel>
                <select className={selectClass} value={formData.urgency} onChange={(e) => handleInputChange("urgency", e.target.value)}>
                  {["low","medium","high"].map((o) => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel>Availability Day</FieldLabel>
                <select className={selectClass} value={formData.availabilityDay} onChange={(e) => handleInputChange("availabilityDay", e.target.value)}>
                  <option value="">Please Select a Day</option>
                  {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Call Header */}
            <p className="text-base font-semibold text-[#333] text-center">Would you be available for a call at your earliest convenience?</p>

            {/* Description */}
            <div>
              <FieldLabel req>Description</FieldLabel>
              <textarea
                rows={4}
                className="w-full border-b border-[#e0e0e0] bg-transparent text-sm text-[#333] placeholder:text-[#999] focus:outline-none focus:border-[#333] py-2 resize-none"
                placeholder="Please describe your requirements in detail..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
              {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Additional Requirements */}
            <div>
              <FieldLabel>Additional Requirements</FieldLabel>
              <textarea
                rows={4}
                className="w-full border-b border-[#e0e0e0] bg-transparent text-sm text-[#333] placeholder:text-[#999] focus:outline-none focus:border-[#333] py-2 resize-none"
                placeholder="Any specific requirements or details..."
                value={formData.additionalRequirements}
                onChange={(e) => handleInputChange("additionalRequirements", e.target.value)}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={submitRFQMutation.isPending}
                className="min-w-[200px] flex items-center justify-center gap-2 text-white font-semibold text-base px-8 py-3 rounded disabled:bg-[#ccc] transition-all"
                style={{ background: submitRFQMutation.isPending ? undefined : "linear-gradient(135deg, rgba(245,138,78,1) 0%, rgba(241,106,60,1) 100%)" }}
              >
                {submitRFQMutation.isPending ? <><Spinner size="sm" className="border-white border-t-transparent" /> Submitting...</> : "Submit RFQ"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-[#f8f9fa] border-t border-[#e0e0e0] p-4 text-center">
          <p className="text-xs text-[#666]">Your information is secure and confidential</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RFQModal;
