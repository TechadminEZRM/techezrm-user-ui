import React, { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useSubmitContactQuery } from "@/api/handlers";

interface ContactFormProps {
  source?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const inputClass =
  "w-full h-10 rounded-lg bg-white/10 border border-white/30 px-4 text-white placeholder:text-white/70 focus:outline-none focus:border-white text-sm";

const ContactForm: React.FC<ContactFormProps> = ({
  source = "website",
  onSuccess,
  onError,
}) => {
  const [formData, setFormData] = useState({ name: "", mobile: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submitQueryMutation = useSubmitContactQuery();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(formData.mobile.replace(/\D/g, ""))) newErrors.mobile = "Please enter a valid 10-digit mobile number";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await submitQueryMutation.mutateAsync({ ...formData, source });
      if (response.success) {
        setFormData({ name: "", mobile: "", email: "", message: "" });
        onSuccess?.();
      } else {
        onError?.(response.message || "Failed to submit query");
      }
    } catch {
      onError?.("Failed to submit query. Please try again.");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const formatMobileNumber = (value: string) => value.replace(/\D/g, "").slice(0, 10);

  return (
    <div
      className="rounded-xl p-6 md:p-8 max-w-[500px] w-full"
      style={{ background: "linear-gradient(135deg, var(--color-earthy) 0%, var(--color-earthy-light, #a0522d) 100%)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
    >
      <h2 className="text-white font-semibold text-xl text-center mb-6">Contact Us</h2>

      {submitQueryMutation.isError && (
        <div className="bg-red-600/20 text-red-200 p-3 rounded-lg mb-4 border border-red-400/30 text-sm">Failed to submit query. Please try again.</div>
      )}
      {submitQueryMutation.isSuccess && (
        <div className="bg-green-600/20 text-green-200 p-3 rounded-lg mb-4 border border-green-400/30 text-sm">Thank you! Your message has been sent successfully.</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <p className="text-white/90 text-sm font-medium mb-2">Name</p>
            <input value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className={inputClass} placeholder="Your name" />
            {errors.name && <p className="text-red-300 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <p className="text-white/90 text-sm font-medium mb-2">Email</p>
            <input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className={inputClass} placeholder="Your email" />
            {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Mobile */}
          <div>
            <p className="text-white/90 text-sm font-medium mb-2">Number</p>
            <input value={formData.mobile} onChange={(e) => handleInputChange("mobile", formatMobileNumber(e.target.value))} className={inputClass} placeholder="9876501234" />
            {errors.mobile && <p className="text-red-300 text-xs mt-1">{errors.mobile}</p>}
          </div>

          {/* Message */}
          <div>
            <p className="text-white/90 text-sm font-medium mb-2">Message</p>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-3 text-white placeholder:text-white/70 focus:outline-none focus:border-white text-sm resize-none"
              placeholder="Please describe your query in detail..."
            />
            {errors.message && <p className="text-red-300 text-xs mt-1">{errors.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitQueryMutation.isPending}
            className="w-full bg-white text-earthy font-semibold text-base py-3 px-6 rounded-[25px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:bg-white/90 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {submitQueryMutation.isPending && <Spinner size="sm" className="border-earthy border-t-transparent" />}
            Contact Us
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
