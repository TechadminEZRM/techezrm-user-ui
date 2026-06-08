"use client";

import type React from "react";
import { useState, useEffect } from "react";

interface FlashSaleProductProps {
  productName: string;
  price: string;
  stockLeft: number;
  totalStock: number;
}

const FlashSaleProduct: React.FC<FlashSaleProductProps> = ({ productName, price, stockLeft, totalStock }) => {
  const progressValue = ((totalStock - stockLeft) / totalStock) * 100;
  return (
    <div className="bg-white rounded-xl p-5 w-[200px] h-[140px] flex flex-col justify-between">
      {/* Product Icon and Name */}
      <div className="flex items-center gap-3 mb-2">
        <div className="relative flex items-center justify-center">
          {/* Bottle */}
          <div className="w-8 h-[42px] bg-[#F9A922] rounded-[4px_4px_2px_2px] flex items-end justify-center pb-1 relative">
            {/* Cap */}
            <div className="w-[22px] h-1.5 bg-[#F9A922] rounded-sm absolute -top-0.5 left-1/2 -translate-x-1/2" />
            <span className="text-white text-[8px] font-bold leading-none mb-0.5">VIT</span>
          </div>
          {/* C Badge */}
          <div className="absolute -right-1 bottom-1 w-3.5 h-3.5 bg-[#ffd700] rounded-full border-[1.5px] border-white flex items-center justify-center">
            <span className="text-white text-[8px] font-bold">C</span>
          </div>
        </div>
        <span className="text-[#333] text-[0.9rem] font-medium">{productName}</span>
      </div>

      {/* Price */}
      <p className="text-[#333] text-[1.1rem] font-semibold mb-2">{price}</p>

      {/* Progress Bar */}
      <div className="mb-1">
        <div className="w-full h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
          <div className="h-full bg-[#F9A922] rounded-full transition-all" style={{ width: `${progressValue}%` }} />
        </div>
      </div>

      {/* Stock Left */}
      <p className="text-[#666] text-[0.8rem] text-right">{stockLeft} left</p>
    </div>
  );
};

const FlashSaleSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 54, minutes: 33, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fmt = (t: number) => t.toString().padStart(2, "0");

  return (
    <div className="bg-[#fef7ed] py-8 md:py-12 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute -top-12 -left-24 w-48 h-72 bg-[#fde68a] opacity-30 rounded-full" style={{ transform: "rotate(-15deg)" }} />
      <div className="absolute -bottom-20 -right-28 w-60 h-48 bg-[#fed7aa] opacity-40 rounded-[30%]" style={{ transform: "rotate(25deg)" }} />

      <div className="max-w-7xl mx-auto px-4 relative">
        <div
          className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8"
          style={{ background: "linear-gradient(135deg, #F9A922 0%, #F9A922 100%)" }}
        >
          {/* Left */}
          <div className="text-white flex-1">
            <h2 className="text-4xl md:text-5xl font-semibold mb-4">Flash Sale</h2>
            <p className="text-base mb-6 opacity-90 max-w-[300px]">
              Limited-time discounts on fast-moving ingredients. Grab exclusive prices before the timer runs out.
            </p>
            <p className="text-3xl md:text-4xl font-semibold font-mono">
              {fmt(timeLeft.hours)}:{fmt(timeLeft.minutes)}:{fmt(timeLeft.seconds)}
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col sm:flex-row gap-4">
            <FlashSaleProduct productName="Product Name" price="$123" stockLeft={30} totalStock={100} />
            <FlashSaleProduct productName="Product Name" price="$123" stockLeft={30} totalStock={100} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleSection;
