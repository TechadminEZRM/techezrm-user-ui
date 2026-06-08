import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQ } from "../api/services/faqs";

interface FAQSectionProps {
  faqs: FAQ[];
  isLoading: boolean;
  error: any;
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs, isLoading, error }) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const toggle = (panel: string) => setExpanded(expanded === panel ? false : panel);

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-[#F9A922] text-center mb-6">Frequently Asked Questions</h2>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="mb-4">
            <div className="h-16 bg-gray-200 rounded-xl animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded w-11/12 animate-pulse mb-1" />
            <div className="h-4 bg-gray-200 rounded w-8/12 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm">Failed to load FAQs. Please try again later.</div>
      </div>
    );
  }

  if (!faqs || faqs.length === 0) {
    return (
      <div className="mt-8 text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-[#F9A922] mb-2">Frequently Asked Questions</h2>
        <p className="text-[#737791] italic">No FAQs available for this product yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2
        className="text-xl md:text-[1.75rem] font-semibold mb-6"
        style={{ background: "linear-gradient(135deg, #F9A922 0%, #ff8c42 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
      >
        Frequently Asked Questions
      </h2>

      <div className="max-w-[800px]">
        {faqs.map((faq, index) => {
          const panel = `panel${index}`;
          const isOpen = expanded === panel;
          return (
            <div
              key={faq._id}
              className="border border-[rgba(255,107,53,0.1)] rounded-xl mb-4 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:border-[rgba(255,107,53,0.3)] hover:shadow-[0_8px_24px_rgba(255,107,53,0.12)] hover:-translate-y-0.5"
              style={{ background: isOpen ? "linear-gradient(135deg, #fff8f6 0%, #fff5f2 100%)" : "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)" }}
            >
              {/* Summary */}
              <button
                type="button"
                onClick={() => toggle(panel)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <h3 className={`text-base md:text-lg font-semibold leading-snug transition-colors ${isOpen ? "text-[#F9A922]" : "text-[#333]"}`}>
                  {faq.question}
                </h3>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-all ${isOpen ? "bg-[rgba(255,107,53,0.2)]" : "bg-[rgba(255,107,53,0.1)]"}`}>
                  {isOpen
                    ? <Minus className="w-5 h-5 text-[#F9A922]" />
                    : <Plus className="w-5 h-5 text-[#F9A922]" />}
                </div>
              </button>

              {/* Details */}
              {isOpen && (
                <div className="px-6 pb-6 bg-[rgba(255,107,53,0.02)] border-t border-[rgba(255,107,53,0.08)]">
                  <p className="text-[#555] text-[0.95rem] leading-[1.7] pt-4">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQSection;
