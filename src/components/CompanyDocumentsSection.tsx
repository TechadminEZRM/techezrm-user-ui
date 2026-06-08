import React, { useState } from "react";
import { ChevronDown, Download, Lock } from "lucide-react";

interface Document {
  name: string;
  expiryDate?: string;
  isLocked?: boolean;
}

interface DocumentCategory {
  title: string;
  count: number;
  documents: Document[];
}

interface CompanyDocumentsSectionProps {
  companySpecific: string;
  facilitySpecific: string;
  productSpecific: string;
  batchSpecific: string;
  onCompanySpecificChange: (value: string) => void;
  onFacilitySpecificChange: (value: string) => void;
  onProductSpecificChange: (value: string) => void;
  onBatchSpecificChange: (value: string) => void;
}

const CompanyDocumentsSection: React.FC<CompanyDocumentsSectionProps> = ({
  companySpecific, facilitySpecific, productSpecific, batchSpecific,
  onCompanySpecificChange, onFacilitySpecificChange, onProductSpecificChange, onBatchSpecificChange,
}) => {
  const [expanded, setExpanded] = useState<number | null>(null);

  const documentCategories: DocumentCategory[] = [
    { title: "Company Specific Documents", count: 3, documents: [
      { name: "Business License", expiryDate: "14-08-2026" },
      { name: "Certificate of Registration", expiryDate: "04-12-2050" },
      { name: "Fair Trade Certificate", expiryDate: "11-09-2027" },
    ]},
    { title: "Facility Specific Documents", count: 1, documents: [
      { name: "FDA Registration", expiryDate: "31-12-2026" },
    ]},
    { title: "Product Specific Documents", count: 4, documents: [
      { name: "BSE-TSE Statement", expiryDate: "24-12-2026" },
      { name: "Non GMO Statement/Certificate", expiryDate: "24-12-2026" },
      { name: "Pesticide Statement/Report", expiryDate: "24-12-2026" },
      { name: "Vegan/Vegetarian Statement", expiryDate: "24-12-2026" },
    ]},
    { title: "Batch Specific Documents", count: 5, documents: [
      { name: "Certificate of Analysis (COA)", isLocked: true },
      { name: "Specification Sheet", isLocked: true },
      { name: "Composition Statement", isLocked: true },
      { name: "MSDS Statement", isLocked: true },
      { name: "COO Statement", isLocked: true },
    ]},
  ];

  return (
    <div className="mt-8 mb-6">
      <h3 className="font-semibold text-[#333] text-lg md:text-xl mb-6">Company Specific Documents</h3>

      {documentCategories.map((category, index) => (
        <div
          key={index}
          className="bg-white border border-[rgba(255,107,53,0.1)] rounded-lg mb-3 shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-all hover:border-[rgba(255,107,53,0.25)] hover:shadow-[0_6px_20px_rgba(255,107,53,0.1)] hover:-translate-y-px overflow-hidden"
          style={{ background: expanded === index ? "linear-gradient(135deg, #fff8f6 0%, #fff5f2 100%)" : "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)" }}
        >
          {/* Accordion Header */}
          <button
            type="button"
            className="w-full flex items-center justify-between p-3 text-left"
            onClick={() => setExpanded(expanded === index ? null : index)}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#333]">{category.title}</span>
              <span className="bg-[rgba(255,107,53,0.1)] text-[#F9A922] px-2 py-0.5 rounded-full text-xs font-semibold min-w-[24px] text-center">
                {category.count}
              </span>
            </div>
            <div className={`w-7 h-7 rounded-full bg-[rgba(255,107,53,0.1)] flex items-center justify-center transition-transform ${expanded === index ? "rotate-180" : ""}`}>
              <ChevronDown className="w-4 h-4 text-[#F9A922]" />
            </div>
          </button>

          {/* Accordion Content */}
          {expanded === index && (
            <div className="px-4 pb-4 bg-[rgba(255,107,53,0.02)] border-t border-[rgba(255,107,53,0.08)]">
              <div className="pt-2">
                {category.documents.map((doc, docIndex) => (
                  <div
                    key={docIndex}
                    className="flex items-center justify-between p-2 px-3 mb-1.5 last:mb-0 bg-white/70 rounded-md border border-[rgba(255,107,53,0.05)] transition-all hover:bg-[rgba(255,107,53,0.05)] hover:border-[rgba(255,107,53,0.1)] hover:translate-x-1"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {doc.isLocked && <Lock className="w-3 h-3 text-[#F9A922] flex-shrink-0" />}
                      <div>
                        <p className="text-xs font-medium text-[#333] leading-tight">{doc.name}</p>
                        {doc.expiryDate && <p className="text-[10px] text-[#666] italic">Expires: {doc.expiryDate}</p>}
                      </div>
                    </div>
                    <button className="bg-[rgba(255,107,53,0.1)] text-[#F9A922] rounded p-1 hover:bg-[rgba(255,107,53,0.2)] transition-colors">
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CompanyDocumentsSection;
