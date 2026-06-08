import React from "react";

interface ShimmerLoaderProps {
  count?: number;
}

const ShimmerLoader: React.FC<ShimmerLoaderProps> = ({ count = 9 }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          {/* Image skeleton */}
          <div className="w-full h-[180px] bg-[#f0f0f0] animate-pulse" />

          {/* Content skeleton */}
          <div className="p-4">
            {/* Title skeleton */}
            <div className="h-5 bg-[#f0f0f0] rounded w-4/5 mb-2 animate-pulse" />

            {/* Description skeletons */}
            <div className="h-4 bg-[#f0f0f0] rounded w-full mb-1.5 animate-pulse" />
            <div className="h-4 bg-[#f0f0f0] rounded w-3/5 mb-4 animate-pulse" />

            {/* Product code skeleton */}
            <div className="h-3.5 bg-[#f0f0f0] rounded w-[70%] mb-4 animate-pulse" />

            {/* Button skeleton */}
            <div className="h-9 bg-[#f0f0f0] rounded w-full animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShimmerLoader;
