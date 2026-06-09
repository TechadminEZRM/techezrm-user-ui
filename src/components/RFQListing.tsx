/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { X, Eye, Calendar, DollarSign, Building2, Mail, Phone, MapPin, Clock, AlertCircle, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRFQListing } from "@/api/handlers/rfqHandler";
import { RFQListingItem } from "@/api/services/rfq";

interface RFQListingProps { customerPhone: string; }

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};
const urgencyStyles: Record<string, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
const formatCurrency = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const InfoRow = ({ icon: Icon, label, value }: { icon: any; label?: string; value: string }) => (
  <div className="flex items-center gap-2 mb-1.5">
    <Icon className="w-4 h-4 text-brand flex-shrink-0" />
    {label && <span className="text-sm font-medium text-body">{label}</span>}
    <span className="text-sm text-dim">{value}</span>
  </div>
);

const Chip = ({ label, className }: { label: string; className: string }) => (
  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${className}`}>{label}</span>
);

const RFQDetailModal: React.FC<{ open: boolean; onClose: () => void; rfq: RFQListingItem | null }> = ({ open, onClose, rfq }) => {
  if (!rfq) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 rounded-2xl overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div
          className="flex justify-between items-center p-6 text-white relative"
          style={{ background: "linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-hover) 100%)" }}
        >
          <div>
            <h2 className="text-xl font-bold">RFQ Details</h2>
            <p className="text-sm opacity-90">{rfq.uniqueId}</p>
          </div>
          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 rounded-full p-1.5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 80px)" }}>
          {/* Product + Status */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 pb-4 border-b border-line-light">
            <div>
              <h3 className="text-lg font-bold text-brand">{rfq.productName}</h3>
              <p className="text-sm text-soft">Quantity: {rfq.quantity} units</p>
            </div>
            <div className="flex gap-2">
              <Chip label={rfq.status.toUpperCase()} className={statusStyles[rfq.status] || "bg-gray-100 text-gray-800"} />
              <Chip label={rfq.urgency.toUpperCase()} className={urgencyStyles[rfq.urgency] || "bg-gray-100 text-gray-800"} />
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-4">
            <h4 className="font-bold text-base mb-3">Customer Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <InfoRow icon={Building2} value={rfq.customerName} />
                <InfoRow icon={Mail} value={rfq.customerEmail} />
                <InfoRow icon={Phone} value={`${rfq.customerPhoneCountryCode} ${rfq.customerPhone}`} />
              </div>
              <div>
                {rfq.companyName && <InfoRow icon={Building2} label="" value={rfq.companyName} />}
                {rfq.companyAddress && <InfoRow icon={MapPin} label="" value={rfq.companyAddress} />}
                {rfq.department && <InfoRow icon={Building2} label="" value={rfq.department} />}
              </div>
            </div>
          </div>

          <hr className="border-line-light mb-4" />

          {/* Project Details */}
          <div className="mb-4">
            <h4 className="font-bold text-base mb-3">Project Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <InfoRow icon={Calendar} label="Expected Delivery:" value={formatDate(rfq.expectedDeliveryDate)} />
                <InfoRow icon={DollarSign} label="Budget:" value={formatCurrency(rfq.budget)} />
              </div>
              <div>
                {rfq.availabilityDay && <InfoRow icon={Clock} label="Availability:" value={rfq.availabilityDay} />}
                {rfq.availabilityTime && <InfoRow icon={Clock} label="Time:" value={rfq.availabilityTime} />}
              </div>
            </div>
          </div>

          <hr className="border-line-light mb-4" />

          {/* Description */}
          <div className="mb-4">
            <h4 className="font-bold text-base mb-3">Description</h4>
            <div className="bg-[rgba(255,107,53,0.05)] border border-[rgba(255,107,53,0.1)] rounded-lg p-3">
              <p className="text-sm text-body">{rfq.description}</p>
            </div>
          </div>

          {/* Additional Requirements */}
          {rfq.additionalRequirements && (
            <>
              <hr className="border-line-light mb-4" />
              <div className="mb-4">
                <h4 className="font-bold text-base mb-3">Additional Requirements</h4>
                <div className="bg-[rgba(255,107,53,0.05)] border border-[rgba(255,107,53,0.1)] rounded-lg p-3">
                  <p className="text-sm text-body">{rfq.additionalRequirements}</p>
                </div>
              </div>
            </>
          )}

          <hr className="border-line-light mb-3" />
          <p className="text-xs text-soft">Created: {formatDate(rfq.createdAt)}</p>
          <p className="text-xs text-soft">Last Updated: {formatDate(rfq.updatedAt)}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StatBox = ({ label, value }: { label: string; value: string }) => (
  <div className="p-3 bg-[rgba(255,107,53,0.05)] border border-[rgba(255,107,53,0.1)] rounded-xl">
    <p className="text-[0.7rem] font-semibold text-soft uppercase mb-1">{label}</p>
    <p className="text-[0.9rem] font-semibold text-brand">{value}</p>
  </div>
);

const RFQListing: React.FC<RFQListingProps> = ({ customerPhone }) => {
  const cleanPhoneNumber = (p: string) => {
    if (!p) return "";
    return p.replace(/^\+?\d{1,3}[- ]?/, "").replace(/^[- ]+/, "");
  };
  const cleanedPhone = cleanPhoneNumber(customerPhone);
  const { data, isLoading, error } = useRFQListing(cleanedPhone);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQListingItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">Your RFQs</h2>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-line-light">
              <div className="h-6 bg-gray-200 rounded w-3/5 mb-3 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-2/5 mb-4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">Your RFQs</h2>
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm">Failed to load RFQs. Please try again later.</div>
      </div>
    );
  }

  const rfqs = data?.data || [];

  return (
    <div>
      {rfqs.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center border border-line-light">
          <h3 className="text-lg font-semibold text-soft mb-2">No RFQs Found</h3>
          <p className="text-sm text-soft">You haven't submitted any RFQs yet. Start by requesting a quote for any product.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {rfqs.map((rfq) => (
            <div
              key={rfq._id}
              className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden border border-[rgba(255,107,53,0.1)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(255,107,53,0.12)] hover:border-[rgba(255,107,53,0.3)]"
              style={{ background: "linear-gradient(135deg, #ffffff 0%, var(--color-paper) 100%)" }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start pb-3 mb-4 border-b border-black/8">
                  <div className="flex-1">
                    <h3 className="text-[1.1rem] font-semibold text-brand mb-1">{rfq.productName}</h3>
                    <p className="text-[0.8rem] text-soft flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-brand inline-block" />
                      {rfq.uniqueId} • {formatDate(rfq.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Chip label={rfq.status.toUpperCase()} className={`${statusStyles[rfq.status] || "bg-gray-100 text-gray-800"} text-[0.7rem]`} />
                    <Chip label={rfq.urgency.toUpperCase()} className={`${urgencyStyles[rfq.urgency] || "bg-gray-100 text-gray-800"} text-[0.7rem]`} />
                  </div>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <StatBox label="Quantity" value={`${rfq.quantity} units`} />
                  <StatBox label="Budget" value={formatCurrency(rfq.budget)} />
                  <StatBox label="Expected Delivery" value={formatDate(rfq.expectedDeliveryDate)} />
                </div>

                {/* Description */}
                <div className="bg-black/[0.02] border border-black/8 rounded-xl p-3 mb-4">
                  <p className="text-[0.7rem] font-semibold text-soft uppercase mb-1">Description</p>
                  <p className="text-[0.85rem] text-body leading-snug">{rfq.description}</p>
                </div>

                {/* View Details */}
                <div className="flex justify-end">
                  <button
                    onClick={() => { setSelectedRFQ(rfq); setModalOpen(true); }}
                    className="flex items-center gap-2 text-sm font-medium text-white px-5 py-2 rounded-xl transition-all hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(255,107,53,0.25)]"
                    style={{ background: "linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-hover) 100%)" }}
                  >
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <RFQDetailModal open={modalOpen} onClose={() => { setModalOpen(false); setSelectedRFQ(null); }} rfq={selectedRFQ} />
    </div>
  );
};

export default RFQListing;
