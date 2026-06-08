"use client";

import React from "react";
import { X, Headphones, MessageCircle, Mail, Phone } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ContactSupportModalProps {
  open: boolean;
  onClose: () => void;
}

const ContactSupportModal: React.FC<ContactSupportModalProps> = ({ open, onClose }) => {
  const handleWhatsAppClick = () => {
    if (typeof window === "undefined") return;
    const phoneNumber = "+1234567890";
    const message = "Hello, I need support with my order.";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleEmailClick = () => {
    if (typeof window === "undefined") return;
    const email = "support@ezrm.com";
    const subject = "Order Support Request";
    const body = "Hello, I need support with my order.";
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handlePhoneClick = () => {
    if (typeof window === "undefined") return;
    window.location.href = "tel:+1234567890";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e0e0e0] bg-[#f8f9fa]">
          <div className="flex items-center gap-3">
            <Headphones className="w-7 h-7 text-[#F9A922]" />
            <div>
              <h2 className="text-xl font-semibold text-[#1a365d]">Contact Support</h2>
              <p className="text-sm text-[#737791]">We're here to help you</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#666] hover:bg-black/5 rounded-full p-1.5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <p className="text-[#737791] text-center mb-6">Choose your preferred way to get in touch with our support team</p>

          <div className="flex flex-col gap-3 mb-6">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppClick}
              className="w-full flex items-center gap-4 p-4 border border-[#25D366] text-[#25D366] rounded-xl hover:bg-[rgba(37,211,102,0.04)] transition-colors text-left"
            >
              <MessageCircle className="w-6 h-6 flex-shrink-0 text-[#25D366]" />
              <div>
                <p className="font-semibold text-base">WhatsApp Support</p>
                <p className="text-sm text-[#737791]">Get instant help via WhatsApp</p>
              </div>
            </button>

            {/* Email */}
            <button
              onClick={handleEmailClick}
              className="w-full flex items-center gap-4 p-4 border border-[#F9A922] text-[#F9A922] rounded-xl hover:bg-[rgba(249,169,34,0.04)] transition-colors text-left"
            >
              <Mail className="w-6 h-6 flex-shrink-0 text-[#F9A922]" />
              <div>
                <p className="font-semibold text-base">Email Support</p>
                <p className="text-sm text-[#737791]">Send us an email and we'll respond within 24 hours</p>
              </div>
            </button>

            {/* Phone */}
            <button
              onClick={handlePhoneClick}
              className="w-full flex items-center gap-4 p-4 border border-[#4CAF50] text-[#4CAF50] rounded-xl hover:bg-[rgba(76,175,80,0.04)] transition-colors text-left"
            >
              <Phone className="w-6 h-6 flex-shrink-0 text-[#4CAF50]" />
              <div>
                <p className="font-semibold text-base">Phone Support</p>
                <p className="text-sm text-[#737791]">Call us directly for immediate assistance</p>
              </div>
            </button>
          </div>

          {/* Business Hours */}
          <div className="bg-[#f8f9fa] rounded-xl p-6 text-center">
            <p className="text-sm text-[#737791] mb-2">Business Hours</p>
            <p className="font-semibold text-[#F9A922]">Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p className="text-sm text-[#737791]">Saturday: 10:00 AM - 4:00 PM</p>
            <p className="text-sm text-[#737791]">Sunday: Closed</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSupportModal;
