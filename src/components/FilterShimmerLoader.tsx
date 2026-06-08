import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const ShimmerAccordion: React.FC<{ rows: number; defaultOpen?: boolean }> = ({ rows, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[rgba(217,217,217,0.21)] mb-1.5">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-between w-full px-4 py-3 min-h-[48px]"
      >
        <div className="h-4 bg-[#f0f0f0] rounded w-20 animate-pulse" />
        <ChevronDown className={`w-5 h-5 text-[#666] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 py-2 flex flex-col gap-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#f0f0f0] rounded animate-pulse flex-shrink-0" />
              <div className="h-4 bg-[#f0f0f0] rounded animate-pulse" style={{ width: `${60 + i * 5}%` }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterShimmerLoader: React.FC = () => (
  <div className="p-0">
    <ShimmerAccordion rows={5} defaultOpen />
    <ShimmerAccordion rows={6} defaultOpen />
  </div>
);

export default FilterShimmerLoader;
