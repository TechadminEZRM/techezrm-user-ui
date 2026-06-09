import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useBookACallQuery } from "@/api/handlers";

interface BookCallModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const inputClass =
  "w-full h-10 rounded-lg bg-white/10 border border-white/30 px-4 text-white placeholder:text-white/70 focus:outline-none focus:border-white text-sm";

const BookCallModal: React.FC<BookCallModalProps> = ({ open, onClose, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: "", email: "", mobile: "", mode: "call", purpose: "", date: "", time: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submitMutation = useBookACallQuery();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const formatPhone = (value: string) => value.replace(/\D/g, "").slice(0, 10);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.mobile.trim()) newErrors.mobile = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(formData.mobile)) newErrors.mobile = "Enter a valid 10-digit number";
    if (!formData.purpose.trim()) newErrors.purpose = "Purpose is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await submitMutation.mutateAsync(formData);
      if (response.success) {
        setFormData({ name: "", email: "", mobile: "", mode: "call", purpose: "", date: "", time: "" });
        onSuccess?.();
        onClose();
      } else {
        onError?.(response.message || "Failed to book call");
      }
    } catch {
      onError?.("Failed to book call. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[700px] rounded-2xl p-8"
        style={{ background: "linear-gradient(135deg, var(--color-earthy) 0%, var(--color-earthy-light, #a0522d) 100%)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
      >
        <DialogTitle className="text-white font-semibold text-center text-[1.7rem]">
          Book a Call
        </DialogTitle>

        {submitMutation.isError && <Alert variant="destructive" className="mb-4">Failed to submit. Please try again.</Alert>}
        {submitMutation.isSuccess && <Alert variant="success" className="mb-4">Thank you! Your booking has been received.</Alert>}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6 mt-4">
            {/* Name & Email */}
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-white/90 text-sm font-medium mb-2">Name</p>
                <input value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className={inputClass} placeholder="Your name" />
                {errors.name && <p className="text-red-300 text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="flex-1">
                <p className="text-white/90 text-sm font-medium mb-2">Email</p>
                <input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className={inputClass} placeholder="Your email" />
                {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Phone & Mode */}
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-white/90 text-sm font-medium mb-2">Phone Number</p>
                <input value={formData.mobile} onChange={(e) => handleInputChange("mobile", formatPhone(e.target.value))} className={inputClass} placeholder="9876501234" />
                {errors.mobile && <p className="text-red-300 text-xs mt-1">{errors.mobile}</p>}
              </div>
              <div className="flex-1">
                <p className="text-white/90 text-sm font-medium mb-2">Mode</p>
                <select value={formData.mode} onChange={(e) => handleInputChange("mode", e.target.value)} className={inputClass}>
                  <option value="call">Call</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>
            </div>

            {/* Purpose */}
            <div>
              <p className="text-white/90 text-sm font-medium mb-2">Purpose</p>
              <textarea
                rows={4}
                value={formData.purpose}
                onChange={(e) => handleInputChange("purpose", e.target.value)}
                className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-3 text-white placeholder:text-white/70 focus:outline-none focus:border-white text-sm resize-none"
                placeholder="Please describe the purpose of the call..."
              />
              {errors.purpose && <p className="text-red-300 text-xs mt-1">{errors.purpose}</p>}
            </div>

            {/* Date & Time */}
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-white/90 text-sm font-medium mb-2">Date</p>
                <input type="date" value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} className={inputClass} />
                {errors.date && <p className="text-red-300 text-xs mt-1">{errors.date}</p>}
              </div>
              <div className="flex-1">
                <p className="text-white/90 text-sm font-medium mb-2">Time</p>
                <input type="time" value={formData.time} onChange={(e) => handleInputChange("time", e.target.value)} className={inputClass} />
                {errors.time && <p className="text-red-300 text-xs mt-1">{errors.time}</p>}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full bg-white text-earthy font-semibold text-base py-3 px-6 rounded-[25px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:bg-white/90 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {submitMutation.isPending ? <Spinner size="sm" className="border-earthy border-t-transparent" /> : null}
              Book a Call
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookCallModal;
