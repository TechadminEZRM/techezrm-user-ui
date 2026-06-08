"use client";
import type React from "react";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import BookCallModal from "@/components/BookCallModal";
import { Button } from "@/components/ui/button";

const FeatureItem: React.FC<{ text: string; dimmed?: boolean }> = ({ text, dimmed }) => (
  <div className={`flex items-center gap-3 py-4 border-b border-[#e0e0e0] cursor-pointer transition-all hover:translate-x-2 ${dimmed ? "opacity-60" : ""}`}>
    <ArrowRight className={`w-6 h-6 shrink-0 ${dimmed ? "text-[#ccc]" : "text-[#F9A922]"}`} />
    <span className={`text-[1.1rem] md:text-[1.25rem] font-medium ${dimmed ? "text-[#999]" : "text-[#333]"}`}>{text}</span>
  </div>
);

const DifferentiatorCard: React.FC<{ title: string; description: string; iconEl: React.ReactNode; colSpan?: string }> = ({ title, description, iconEl, colSpan }) => (
  <div className={`p-6 md:p-8 text-center transition-all hover:-translate-y-0.5 ${colSpan || ""}`}>
    <div className="w-15 h-15 mx-auto mb-6 flex items-center justify-center bg-[#f8f9fa] rounded-card">
      {iconEl}
    </div>
    <h3 className="font-semibold text-[#333] text-[1.1rem] md:text-[1.25rem] mb-3">{title}</h3>
    <p className="text-sm text-[#666] leading-relaxed">{description}</p>
  </div>
);

const PixelPerfectClone: React.FC = () => {
  const [bookCallModalOpen, setBookCallModalOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <Image src="/aboutbg.png" alt="About Background" fill style={{ objectFit: "cover", objectPosition: "center" }} priority />
        <div className="absolute inset-0 bg-[rgba(19,21,35,0.6)] z-1" />
        <div className="relative z-2 max-w-7xl mx-auto px-6 md:px-4 text-center">
          <div className="max-w-225 mx-auto flex flex-col items-center gap-8 md:gap-10">
            <h1 className="font-semibold text-white text-[2.5rem] sm:text-[3.5rem] md:text-[3rem] leading-tight tracking-tight mb-6 md:mb-8">
              Fueling Possibilities Through Innovation
            </h1>
            <p className="text-white/85 text-base sm:text-lg md:text-base leading-relaxed max-w-200 mx-auto mb-6 md:mb-4">
              At Easy Raw Materials Pvt. Ltd. (EZRM), we dont just supply ingredients—we fuel possibilities. Nestled in
              the high-performance hub of JNPT SEZ, India, we are reimagining the supply chain for food, pharma,
              nutraceutical, and animal nutrition industries.
            </p>
            <Button
              onClick={() => setBookCallModalOpen(true)}
              className="bg-[#F9A922] hover:bg-primary-hover text-white font-semibold text-base rounded-[50px] px-10 md:px-12 py-3 md:py-3 min-w-40 md:min-w-55 shadow-[0_4px_16px_rgba(255,107,53,0.3)] hover:shadow-[0_6px_20px_rgba(255,107,53,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Book a Call
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full flex justify-center items-center py-8 md:py-12">
        <div className="w-[80%] flex flex-col md:flex-row shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-card overflow-hidden md:h-screen">
          {/* Left - Core Services */}
          <div className="w-full md:w-1/2 bg-[#fafafa] flex items-center py-12 md:py-16 px-6 md:px-12">
            <div className="max-w-125 mx-auto w-full">
              <h2 className="font-semibold text-[#333] text-[2rem] md:text-[2.5rem] lg:text-[3rem] leading-tight tracking-tight mb-8 md:mb-12">
                Our <span className="text-[#F9A922]">Core Services</span> &<br />Capabilities
              </h2>
              <div className="flex flex-col gap-3">
                <FeatureItem text="Warehouse & Distribution" />
                <FeatureItem text="Innovation in Manufacturing" dimmed />
              </div>
            </div>
          </div>
          {/* Right - Details */}
          <div className="w-full md:w-1/2 bg-white flex items-center py-12 md:py-16 px-6 md:px-12 min-h-125 md:min-h-full">
            <div className="max-w-125 mx-auto w-full">
              <p className="text-sm md:text-base text-[rgba(10,10,10,0.8)] leading-relaxed mb-8 md:mb-10">
                Powered for scale and speed—EZRM streamlines how vitamins, sweeteners, amino acids, liposomes, and
                microencapsulated solutions move from our doors to yours.
              </p>
              <p className="text-base md:text-[1.1rem] font-medium text-black leading-relaxed mb-6 md:mb-8">
                We engineer tomorrows solutions today. From precision vitamins and amino acids to cutting-edge
                liposomal and microencapsulation technologies, our offerings include:
              </p>
              <div className="flex flex-col gap-3">
                {["High-performance specialty ingredients", "Advanced liposomal formulations", "Precision microencapsulation solutions", "Quality vitamins and amino acids", "SEZ advantages for global reach"].map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F9A922] mt-1.5 shrink-0" />
                    <p className="text-sm md:text-base text-[rgba(5,5,5,0.9)] leading-relaxed">{f}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <Image src="/vision.png" alt="Mission Background - Earth from Space" fill style={{ objectFit: "cover", objectPosition: "center" }} priority />
        <div className="absolute inset-0 bg-black/30 z-1" />
        <div className="relative z-2 max-w-7xl mx-auto px-6 md:px-8 text-center">
          <div className="max-w-250 mx-auto flex flex-col items-center gap-6 md:gap-4">
            <h2 className="font-semibold text-white text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] leading-tight tracking-tight mb-6 md:mb-8">
              Our <span className="text-[#F9A922]">Mission</span>
            </h2>
            <p className="text-white/95 text-base sm:text-lg md:text-[1.25rem] lg:text-base leading-relaxed max-w-250 mx-auto">
              To make your supply chain faster, smarter, and more inventive than ever. We are innovators driven by
              efficiency, guided by science, and committed to unmatched reliability.
            </p>
          </div>
        </div>
      </div>

      {/* What Makes EZRM Different */}
      <div className="flex justify-center items-center bg-[#fafafa]">
        <div className="w-[95%] py-12 md:py-20 px-6 md:px-8 bg-white m-6 rounded-[20px]">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-20 mb-12 md:mb-16 text-left">
              <h2 className="font-semibold text-[#333] text-[1.8rem] sm:text-[2.2rem] md:text-[1.5rem] leading-tight tracking-tight mb-6 md:mb-10 shrink-0">
                What Makes EZRM <span className="text-[#F9A922]">Different</span> from others
              </h2>
              <p className="text-sm md:text-base text-[#666] leading-relaxed max-w-250">
                We are more than logistics and production. At EZRM, we combine strategic location advantages with
                cutting-edge technology and unwavering commitment to quality and innovation.
              </p>
            </div>

            {/* Top 3 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
              <DifferentiatorCard
                title="SEZ Strategic Location"
                description="JNPT SEZ advantages for seamless global operations and cost efficiency."
                iconEl={<div className="w-8 h-8 bg-[#F9A922] rounded-lg relative before:content-[''] before:absolute before:w-4 before:h-0.5 before:bg-white before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 after:content-[''] after:absolute after:w-2 after:h-2 after:bg-white after:rounded-full after:top-1.5 after:right-1.5" />}
              />
              <DifferentiatorCard
                title="Advanced Manufacturing"
                description="Cutting-edge liposomal and microencapsulation technologies."
                iconEl={<div className="w-8 h-6 bg-[#F9A922] rounded-xs relative before:content-[''] before:absolute before:w-1.5 before:h-1.5 before:bg-white before:rounded-[1px] before:top-1 before:left-1 after:content-[''] after:absolute after:w-4 after:h-0.5 after:bg-white after:rounded-[1px] after:bottom-1 after:left-1" />}
              />
              <DifferentiatorCard
                title="Integrated Supply Chain"
                description="Seamless manufacturing, warehousing, and distribution solutions."
                colSpan="sm:col-span-2 md:col-span-1"
                iconEl={<div className="w-8 h-5 bg-[#4a90e2] rounded-xs relative before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:rounded-full before:top-1/2 before:left-1 before:-translate-y-1/2 after:content-[''] after:absolute after:w-1 after:h-1 after:bg-[#F9A922] after:rounded-full after:top-0.5 after:right-1" />}
              />
            </div>

            {/* Bottom 2 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-200 mx-auto">
              <DifferentiatorCard
                title="Quality Assurance"
                description="Rigorous testing and quality control for pharmaceutical-grade standards."
                iconEl={<div className="w-8 h-8 relative flex items-center justify-center"><div className="w-3 h-3 bg-[#ffa500] rounded-full absolute" /><div className="w-6 h-6 border-2 border-[#ffa500] rounded-full absolute" /><div className="w-0.5 h-2 bg-[#ffa500] absolute top-0.5" /></div>}
              />
              <DifferentiatorCard
                title="Future-Forward Vision"
                description="Pioneering next-generation solutions for tomorrows challenges."
                iconEl={<div className="w-5 h-5 border-[3px] border-[#4a90e2] rounded-full relative before:content-[''] before:absolute before:w-1.5 before:h-1.5 before:bg-[#4a90e2] before:rounded-full before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 after:content-[''] after:absolute after:w-0.5 after:h-2 after:bg-[#4a90e2] after:-top-2 after:left-1/2 after:-translate-x-1/2" />}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Who We Are Section */}
      <div className="w-full py-12 md:py-20 px-6 md:px-8 bg-[#fafafa]">
        <div className="max-w-360 mx-auto flex flex-col lg:flex-row gap-8 lg:gap-0 items-stretch">
          {/* Left - Image */}
          <div className="w-full lg:w-1/2 relative min-h-75 md:min-h-100 lg:min-h-125 rounded-[20px] overflow-hidden">
            <Image src="/aboutlast.png" alt="EZRM Team - Professional business meeting" fill style={{ objectFit: "cover", objectPosition: "center" }} priority />
          </div>
          {/* Right - Cards */}
          <div className="w-full lg:w-1/2 flex flex-col lg:pl-8">
            <div className="bg-[#2c3e50] rounded-[20px] p-8 md:p-10 mb-6 flex-1 flex flex-col justify-center">
              <h3 className="font-semibold text-white text-[1.75rem] md:text-[2.25rem] lg:text-[2.5rem] leading-tight tracking-tight mb-6">
                WHO <span className="text-[#F9A922]">WE</span> ARE ?
              </h3>
              <p className="text-sm md:text-base text-white/90 leading-relaxed">
                Easy Raw Materials Pvt. Ltd. (EZRM) is strategically positioned in the JNPT SEZ, India, specializing in
                high-performance ingredients for food, pharma, nutraceutical, and animal nutrition industries. We
                combine manufacturing excellence with distribution efficiency to deliver innovative solutions globally.
              </p>
            </div>
            <div className="bg-[#F9A922] rounded-[20px] p-8 md:p-10 flex-1 flex flex-col justify-center">
              <h3 className="font-semibold text-white text-[1.75rem] md:text-[2.25rem] lg:text-[2.5rem] leading-tight tracking-tight mb-6">Our Promise</h3>
              <p className="text-sm md:text-base text-white leading-relaxed mb-4">
                We are more than logistics and production. At EZRM, we are innovators driven by efficiency, guided by
                science, and committed to unmatched reliability. With SEZ advantages and a future-forward vision, our
                mission is clear:
              </p>
              <p className="text-sm md:text-base text-white font-medium leading-relaxed italic">
                To make your supply chain faster, smarter, and more inventive than ever.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BookCallModal open={bookCallModalOpen} onClose={() => setBookCallModalOpen(false)} />
    </div>
  );
};

export default PixelPerfectClone;
