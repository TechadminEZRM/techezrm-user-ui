import React from "react";
import { X, CheckCircle2, Copy } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface RFQSuccessModalProps {
  open: boolean;
  onClose: () => void;
  responseData: {
    uniqueId: string;
    customerName: string;
    customerEmail: string;
    productName: string;
    quantity: number;
    status: string;
    urgency: string;
    createdAt: string;
  };
}

const urgencyBadge = (u: string) => {
  if (u === "high") return "bg-[#f8d7da] border-[#f5c6cb] text-[#721c24]";
  if (u === "medium") return "bg-[#fff3cd] border-[#ffeaa7] text-[#856404]";
  return "bg-[#d1ecf1] border-[#bee5eb] text-[#0c5460]";
};

const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });

const RFQSuccessModal: React.FC<RFQSuccessModalProps> = ({ open, onClose, responseData }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        {/* Header */}
        <div
          className="text-white p-6 relative overflow-hidden text-center"
          style={{ background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)" }}
        >
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full translate-x-9 -translate-y-9" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)" }} />
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-1 drop-shadow-sm">RFQ Submitted Successfully!</h2>
            <p className="text-sm opacity-90">Your request has been received and is being processed</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6" style={{ background: "linear-gradient(180deg, #fafafa 0%, #ffffff 100%)" }}>
          {/* ID Card */}
          <div className="bg-white border border-[#e9ecef] rounded-2xl p-5 mb-5">
            {/* RFQ ID */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#666] mb-2">RFQ Reference ID</p>
              <div className="flex items-center gap-2 p-3 rounded-xl border border-[#dee2e6]" style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" }}>
                <span className="text-base font-bold text-[#28a745] font-mono flex-1">{responseData.uniqueId}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(responseData.uniqueId)}
                  className="text-[#6c757d] hover:text-[#28a745] hover:bg-[rgba(40,167,69,0.1)] rounded p-1 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-3">
              {[
                ["Customer Name:", responseData.customerName],
                ["Email:", responseData.customerEmail],
                ["Product:", responseData.productName],
                ["Quantity:", String(responseData.quantity)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-sm text-[#666] font-medium">{label}</span>
                  <span className="text-sm text-[#333] font-semibold">{value}</span>
                </div>
              ))}

              <div className="flex justify-between items-center">
                <span className="text-sm text-[#666] font-medium">Status:</span>
                <span className="text-xs font-semibold uppercase px-3 py-1 rounded-full bg-[#fff3cd] border border-[#ffeaa7] text-[#856404]">{responseData.status}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-[#666] font-medium">Urgency:</span>
                <span className={`text-xs font-semibold uppercase px-3 py-1 rounded-full border ${urgencyBadge(responseData.urgency)}`}>{responseData.urgency}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-[#666] font-medium">Submitted:</span>
                <span className="text-sm text-[#333] font-semibold">{formatDate(responseData.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-5">
            <p className="text-base font-semibold text-[#333] mb-3">What happens next?</p>
            <div className="flex flex-col gap-2">
              {["Our team will review your request within 24 hours", "You'll receive a detailed quote via email", "Schedule a call to discuss your requirements"].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#28a745] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                  <span className="text-sm text-[#666]">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="border border-[#28a745] text-[#28a745] font-semibold px-5 py-2.5 rounded-[25px] hover:bg-[rgba(40,167,69,0.1)] transition-colors"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="text-white font-semibold px-5 py-2.5 rounded-[25px] transition-all"
              style={{ background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)" }}
            >
              Track RFQ
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RFQSuccessModal;
