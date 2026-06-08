import React from "react";
import { Search } from "lucide-react";
import CompanyContactInfo from "@/components/CompanyContactInfo";

export default function HealthClaimsPage() {
  return (
    <div className="min-h-screen">
      <div className="w-full py-64 flex flex-col justify-center items-center relative"
        style={{ backgroundImage: "url('https://nutraceuticalsgroup.com/images/mainImage.webp')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-[2] text-center mb-6">
          <h1 className="font-bold text-white text-[clamp(2.5rem,5vw,4rem)] mb-2 tracking-[0.02em]" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>Health Claims</h1>
          <p className="text-white/90 font-normal text-lg md:text-xl" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>EFSA Approved Nutrition &amp; Health Claims Database</p>
        </div>
        <div className="relative z-[2] w-[90%] max-w-[700px]">
          <div className="relative flex items-center bg-white/95 backdrop-blur-[15px] rounded-[50px]" style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)" }}>
            <input placeholder="Search health claims, nutrients, or EFSA regulations..."
              className="w-full h-[60px] text-lg px-6 pr-16 rounded-[50px] bg-transparent text-[#2c3e50] font-medium placeholder:text-[#7f8c8d] focus:outline-none" />
            <div className="absolute right-3 flex items-center justify-center w-10 h-10 rounded-full bg-[#F9A922] transition-transform hover:scale-110" style={{ boxShadow: "0 4px 12px rgba(249,169,34,0.3)" }}>
              <Search className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-center mt-2 text-white/90 text-sm font-medium">Access comprehensive EFSA health claims and regulatory guidance</p>
        </div>
      </div>

      <div className="px-4 py-6 max-w-[1200px] mx-auto">
        <h2 className="mb-3 font-bold text-[#333] text-2xl">EFSA Health Claims - European Food Safety Authority</h2>
        <p className="mb-4 text-[#666] leading-relaxed">The European Food Safety Authority (EFSA) regulates nutrition and health claims made on foods in the European Union. This comprehensive database provides access to approved health claims, regulatory guidance, and compliance requirements for food and supplement manufacturers.</p>

        <h3 className="mt-4 mb-3 font-bold text-[#333] text-xl">Key Resources &amp; Links</h3>
        <p className="mb-2 text-[#666] leading-relaxed">Follow the two links below for a breakdown of current EFSA health claims:</p>
        <ul className="mb-3 flex flex-col gap-1 list-none">
          <li><a href="#" className="text-[#1976d2] font-medium no-underline hover:underline">Full list of EFSA health claims with Conditions of use of the claim / Restrictions of use</a></li>
          <li><a href="#" className="text-[#1976d2] font-medium no-underline hover:underline">EFSA health claims summary by category</a></li>
        </ul>
        <p className="mb-4 text-[#666] leading-relaxed">For a list of Nutraceuticals Branded Blends that can help you achieve some of these health claims – please check here</p>

        <h3 className="mt-4 mb-3 font-bold text-[#333] text-xl">EU Register of Approved Nutrition and Health Claims</h3>
        <p className="mb-4 text-[#666] leading-relaxed">These are divided into 4 sections:</p>

        {[
          {
            title: "Article 13(1) – General Function Claims",
            body: '"General function" claims under Article 13(1) of the EC Regulation on nutrition and health claims refer to the role of a nutrient or substance in growth, development and body functions; psychological and behavioural functions; slimming and weight control, satiety or reduction of available energy from the diet.'
          },
          {
            title: "Article 13(5) – Newly Developed Scientific Evidence Claims",
            body: "Claims under article 13(5) EC Regulation on nutrition and health claims are those based on newly developed scientific evidence and/or for which protection of proprietary data is requested. For these health claims authorisation is required on a case-by-case basis, following the submission of a scientific dossier to EFSA for assessment."
          },
          {
            title: "Article 14(1a) – Reduction of Disease Risk Claims",
            body: "Claims under Article 14(1a) of the EC Regulation on nutrition and health claims refer to the reduction of disease risk."
          },
          {
            title: "Article 14(1b) – Children's Development or Health Claims",
            body: "Claims under Article 14(1b) of the EC Regulation on nutrition and health claims refer to children's development or health."
          },
        ].map((item, i) => (
          <div key={i} className="mb-3 rounded-xl border border-[#e9ecef] bg-white p-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h4 className="mb-2 font-bold text-[#333] text-base">{item.title}</h4>
            <p className="text-[#666] leading-relaxed">{item.body}</p>
          </div>
        ))}

        <h3 className="mt-4 mb-3 font-bold text-[#333] text-xl">More Helpful Links</h3>
        <ul className="mb-4 flex flex-col gap-1 list-none">
          <li><a href="#" className="text-[#1976d2] font-medium no-underline hover:underline">EU Register of approved nutrition and health claims made on foods</a></li>
          <li><a href="#" className="text-[#1976d2] font-medium no-underline hover:underline">Health Claims List as Excel</a></li>
          <li><a href="#" className="text-[#1976d2] font-medium no-underline hover:underline">Health Claims List as PDF</a></li>
        </ul>

        <p className="mb-6 text-[#666] leading-relaxed">Please contact our friendly and knowledgeable technical sales colleagues to help guide you to the best ingredients to allow you to make health claims on your products.</p>

        <div className="mt-6 mb-4 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg p-4">
          <p className="text-[#666] text-sm leading-relaxed italic">All information is correct to the best of our knowledge and Nutraceuticals Group Europe takes no responsibility for any errors or mistakes. Links to other sources and reference material are included for accuracy. Any errors or omissions? Please let us know through our contact form.</p>
        </div>
        <CompanyContactInfo />
      </div>
    </div>
  );
}
