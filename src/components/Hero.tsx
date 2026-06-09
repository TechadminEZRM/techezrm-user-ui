import type React from "react";
import SearchBox from "./SearchBox";
import Image from "next/image";

const Hero: React.FC = () => {
  return (
    <div
      className="w-screen relative bg-brand bg-cover bg-center bg-no-repeat left-1/2 -translate-x-1/2"
    >
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-8 md:py-16">
          {/* Logo */}
          <Image
            src="/ezrm-logo.png"
            width={100}
            height={100}
            alt="EZRM - Raw Materials Simplified"
            className="w-70 h-12 sm:h-20 md:h-36 mb-4 object-contain mix-blend-multiply"
          />

          {/* Description */}
          <p className="text-white/90 mb-8 mt-2 max-w-3xl">
            Discover premium raw materials and ingredients for your business. From BCAA to specialty compounds, we simplify sourcing with quality assurance and competitive pricing.
          </p>

          {/* Search Box */}
          <div className="w-full max-w-3xl mb-12">
            <SearchBox
              fullWidth
              placeholder="Search for raw materials, supplements, ingredients..."
              showDropdown={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
