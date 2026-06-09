import React from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ContactForm from "./ContactForm";

interface ContactFormModalProps {
  open: boolean;
  onClose: () => void;
  source?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const ContactFormModal: React.FC<ContactFormModalProps> = ({
  open,
  onClose,
  source = "modal",
  onSuccess,
  onError,
}) => {
  const handleSuccess = () => {
    onSuccess?.();
    setTimeout(() => { onClose(); }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-[520px]">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/90 text-earthy rounded-full p-1.5 hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <ContactForm source={source} onSuccess={handleSuccess} onError={onError} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormModal;
