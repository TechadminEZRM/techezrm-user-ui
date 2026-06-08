"use client";
import React from "react";
import ContactForm from "@/components/ContactForm";
import { useCompanyDetails } from "@/hooks/use-company-details";

const ContactPage: React.FC = () => {
  const { companyDetails, loading } = useCompanyDetails();

  const handleSuccess = () => { console.log("Contact form submitted successfully"); };
  const handleError = (error: string) => { console.error("Contact form error:", error); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#333] mb-4">Get in Touch</h1>
        <p className="text-lg text-[#666] max-w-[600px] mx-auto leading-relaxed">
          Have questions about our products or services? We'd love to hear from
          you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 justify-center">
        {/* Contact Information */}
        <div className="w-full md:w-1/2">
          <div className="p-8 rounded-[16px] bg-[#f8f9fa] h-fit">
            <h2 className="text-xl font-semibold text-[#333] mb-6">Contact Information</h2>

            <div className="mb-8">
              <h3 className="text-base font-semibold text-[#F9A922] mb-2">Address</h3>
              <p className="text-[#666] leading-relaxed">
                {loading ? "Loading..." : companyDetails?.address || "123 Business Street, Suite 100, City, State 12345"}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-base font-semibold text-[#F9A922] mb-2">Phone</h3>
              <p className="text-[#666] leading-relaxed">
                {loading ? "Loading..." : companyDetails?.phone || "+1 (555) 123-4567"}<br />
                Monday - Friday, 9:00 AM - 6:00 PM EST
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-base font-semibold text-[#F9A922] mb-2">Email</h3>
              <p className="text-[#666] leading-relaxed">
                {loading ? "Loading..." : companyDetails?.email || "info@greenjeeva.com"}<br />
                support@ezrm.com
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#F9A922] mb-2">Business Hours</h3>
              <p className="text-[#666] leading-relaxed">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full md:w-1/2">
          <ContactForm source="contact_page" onSuccess={handleSuccess} onError={handleError} />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
