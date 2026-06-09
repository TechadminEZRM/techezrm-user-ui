"use client";

import React from "react";
import { X, Printer } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatDate } from "@/utils/dateUtils";

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  order?: any;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ open, onClose, order }) => {
  const fmt = (amount: number) => `$${amount.toFixed(2)}`;

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[210mm] p-0 overflow-hidden max-h-[90vh]">
        <div className="invoice-print overflow-auto max-h-[90vh] relative">
          {/* Action Buttons */}
          <div className="no-print absolute top-4 right-4 flex gap-2 z-50">
            <button onClick={onClose} className="text-dim hover:text-body p-1 rounded-full hover:bg-black/5 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="text-sm border border-dim text-dim px-4 py-1.5 rounded-lg hover:bg-black/5 transition-colors">Close</button>
            <button
              onClick={() => typeof window !== "undefined" && window.print()}
              className="flex items-center gap-2 text-sm bg-brand text-white px-4 py-1.5 rounded-lg hover:bg-brand-hover transition-colors"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>

          {/* Invoice Header */}
          <div className="flex justify-between items-start p-8 border-b-2 border-line-light">
            <div>
              <h1 className="text-3xl font-bold text-heading mb-1">INVOICE</h1>
              <p className="text-soft">Invoice #: {order?.uniqueId || "N/A"}</p>
              <p className="text-soft">Date: {formatDate(order?.createdAt)}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-semibold text-heading">EZRM</h3>
              <p className="text-sm text-soft">Your Trusted Partner</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {/* Bill/Ship Info */}
            <div className="flex justify-between mb-8">
              <div>
                <h4 className="font-semibold text-base mb-3">Bill To:</h4>
                <p className="font-medium">{order?.customer?.name || "N/A"}</p>
                <p className="text-sm text-soft">{order?.customer?.email || "N/A"}</p>
                <p className="text-sm text-soft">{order?.customer?.phone || "N/A"}</p>
              </div>
              <div>
                <h4 className="font-semibold text-base mb-3">Ship To:</h4>
                <p className="font-medium">{order?.shippingAddress?.fullName || "N/A"}</p>
                <p className="text-sm text-soft">{order?.shippingAddress?.address || "N/A"}</p>
                <p className="text-sm text-soft">
                  {order?.shippingAddress?.city || "N/A"}, {order?.shippingAddress?.state || "N/A"} {order?.shippingAddress?.zipCode || "N/A"}
                </p>
                <p className="text-sm text-soft">{order?.shippingAddress?.country || "N/A"}</p>
              </div>
            </div>

            {/* Status */}
            <div className="mb-6">
              <p className="text-sm text-soft">Order Status: {order?.orderStatus || "N/A"}</p>
              <p className="text-sm text-soft">Payment Status: {order?.paymentStatus || "N/A"}</p>
            </div>

            {/* Items Table */}
            <div className="border border-line-light rounded-lg overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-paper">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-heading">Item</th>
                    <th className="text-center px-4 py-3 font-semibold text-heading">Quantity</th>
                    <th className="text-right px-4 py-3 font-semibold text-heading">Unit Price</th>
                    <th className="text-right px-4 py-3 font-semibold text-heading">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-light">
                  {order.items?.map((item: any, i: number) => (
                    <tr key={i}>
                      <td className="px-4 py-3 font-medium">{item?.product?.name || "N/A"}</td>
                      <td className="px-4 py-3 text-center">{item?.quantity || 0}</td>
                      <td className="px-4 py-3 text-right">{fmt(item?.product?.price || 0)}</td>
                      <td className="px-4 py-3 text-right">{fmt(item?.totalPrice || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="min-w-[200px]">
                <div className="flex justify-between py-2 border-b border-line-light">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="font-semibold">{fmt(order?.totalAmount || 0)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-line-light">
                  <span className="font-semibold">Shipping:</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-heading">
                  <span className="text-lg font-bold text-heading">Total:</span>
                  <span className="text-lg font-bold text-heading">{fmt(order?.totalAmount || 0)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 pt-6 border-t border-line-light">
              <p className="text-sm text-soft">Thank you for your business!</p>
              <p className="text-sm text-soft">For any questions, please contact our support team.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
