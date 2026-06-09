import React from "react";
import { Search } from "lucide-react";
import CompanyContactInfo from "@/components/CompanyContactInfo";
import Image from "next/image";

export default function CapsuleSizesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="w-full py-64 flex flex-col justify-center items-center relative"
        style={{ backgroundImage: "url('https://nutraceuticalsgroup.com/images/mainImage.webp')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-[2] text-center mb-6">
          <h1 className="font-bold text-white text-[clamp(2.5rem,5vw,4rem)] mb-2 tracking-[0.02em]" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
            Capsule Sizes
          </h1>
          <p className="text-white/90 font-normal text-lg md:text-xl" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>
            Complete Guide to Capsule Dimensions &amp; Specifications
          </p>
        </div>
        <div className="relative z-[2] w-[90%] max-w-[700px]">
          <div className="relative flex items-center bg-white/95 backdrop-blur-[15px] rounded-[50px]" style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)" }}>
            <input
              placeholder="Search capsule sizes, dimensions, or specifications..."
              className="w-full h-[60px] text-lg px-6 pr-16 rounded-[50px] bg-transparent text-heading font-medium placeholder:text-soft focus:outline-none"
            />
            <div className="absolute right-3 flex items-center justify-center w-10 h-10 rounded-full bg-brand transition-transform hover:scale-110" style={{ boxShadow: "0 4px 12px rgba(249,169,34,0.3)" }}>
              <Search className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-center mt-2 text-white/90 text-sm font-medium">
            Find the perfect capsule size for your supplement formulation
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 max-w-[1200px] mx-auto">
        <h2 className="mb-3 font-bold text-body text-2xl">Capsule Sizes</h2>
        <p className="mb-4 text-dim leading-relaxed">
          Whilst Nutraceuticals Group Europe does not provide hard-capsules, many of our products are suitable for hard-cap dosing. The diagrams and tables below detail the dimensions of various sizes of capsule, and the capacity they allow.
        </p>
        <p className="mb-4 text-dim leading-relaxed">
          For more information about the data below, or any other technical queries regarding the various herbals, aminos and vitamins suitable for hard capsules, please do not hesitate in contacting one of our friendly staff.
        </p>

        {/* Capsule Diagram */}
        <div className="text-center my-6">
          <h3 className="mb-3 font-bold text-body text-xl">Capsule Dimensions</h3>
          <div className="relative w-full max-w-[800px] h-[400px] mx-auto rounded-xl overflow-hidden" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
            <Image src="https://nutraceuticalsgroup.com/storage/Capsule%20Diagram%20English.jpg" alt="Capsule Dimensions Diagram" fill style={{ objectFit: "contain" }} />
          </div>
        </div>

        <h3 className="mt-4 mb-3 font-bold text-body text-xl">Capsule Volume / Mass Capacity</h3>
        <h4 className="mb-2 font-bold text-dim text-lg">Empty Capsule Capacity and Mass</h4>
        <div className="overflow-x-auto mb-6 shadow-md rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-paper">
                <th className="font-bold text-left p-3 text-sm border-b border-line-light">Size</th>
                <th className="font-bold text-left p-3 text-sm border-b border-line-light">Length (mm)</th>
                <th className="font-bold text-left p-3 text-sm border-b border-line-light">Body Length (mm)</th>
                <th className="font-bold text-left p-3 text-sm border-b border-line-light">Diameter (mm)</th>
                <th className="font-bold text-left p-3 text-sm border-b border-line-light">Cap Length (mm)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["0","26","21.8","9.6","12.8"],
                ["00","23.4","20.1","8.2","11.8"],
                ["000","21.5","18.4","7.3","10.8"],
                ["1","19.4","16.3","6.6","9.8"],
                ["2","17.6","15.1","6.1","8.8"],
                ["3","15.7","13.4","5.6","8"],
                ["4","14.3","12.1","5.1","7.1"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-line-light hover:bg-gray-50">
                  {row.map((cell, j) => <td key={j} className="p-3 text-sm text-body">{cell}</td>)}
                </tr>
              ))}
              <tr className="bg-wash border-b border-line-light">
                <td className="p-3 text-sm font-bold text-body">Tol.</td>
                <td className="p-3 text-sm text-body">± 0.30</td>
                <td className="p-3 text-sm text-body">± 0.35</td>
                <td className="p-3 text-sm text-body">–</td>
                <td className="p-3 text-sm text-body">± 0.35</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="mb-2 font-bold text-dim text-lg">Mass Capacity by Powder Density</h4>
        <div className="overflow-x-auto mb-6 shadow-md rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-paper">
                <th className="font-bold text-left p-3 text-sm border-b border-line-light">Size</th>
                <th className="font-bold text-left p-3 text-sm border-b border-line-light">Mass (mg) - 0.6 g/ml</th>
                <th className="font-bold text-left p-3 text-sm border-b border-line-light">Mass (mg) - 0.8 g/ml</th>
                <th className="font-bold text-left p-3 text-sm border-b border-line-light">Mass (mg) - 1.0 g/ml</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["000","822","1096","1370"],
                ["00","570","760","950"],
                ["0","408","544","680"],
                ["1","288","384","480"],
                ["2","216","288","360"],
                ["3","162","216","270"],
                ["4","120","160","200"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-line-light hover:bg-gray-50">
                  {row.map((cell, j) => <td key={j} className="p-3 text-sm text-body">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 mb-4 bg-surface border border-line rounded-lg p-4">
          <p className="text-dim text-sm leading-relaxed italic">
            All information is correct to the best of our knowledge and Nutraceuticals Group Europe takes no responsibility for any errors or mistakes. Links to other sources and reference material are included for accuracy. Any errors or omissions? Please let us know through our contact form.
          </p>
        </div>

        <CompanyContactInfo />
      </div>
    </div>
  );
}
