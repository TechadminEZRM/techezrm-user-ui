import React from "react";
import { Search } from "lucide-react";
import CompanyContactInfo from "@/components/CompanyContactInfo";

const HERO_BG = "url('https://nutraceuticalsgroup.com/images/mainImage.webp')";

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="font-bold text-left p-3 text-sm border-b border-[#e8e8e8] bg-[#f5f5f5]">{children}</th>
);
const TD = ({ children }: { children: React.ReactNode }) => (
  <td className="p-3 text-sm text-[#333]">{children}</td>
);

export default function DietaryReferenceValuesPage() {
  return (
    <div className="min-h-screen">
      <div className="w-full py-64 flex flex-col justify-center items-center relative"
        style={{ backgroundImage: HERO_BG, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-[2] text-center mb-6">
          <h1 className="font-bold text-white text-[clamp(2.5rem,5vw,4rem)] mb-2 tracking-[0.02em]" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
            Dietary Reference Values
          </h1>
          <p className="text-white/90 font-normal text-lg md:text-xl" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>
            NRV, RDA & Nutritional Requirements Database
          </p>
        </div>
        <div className="relative z-[2] w-[90%] max-w-[700px]">
          <div className="relative flex items-center bg-white/95 backdrop-blur-[15px] rounded-[50px]" style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)" }}>
            <input placeholder="Search nutrients, vitamins, minerals, or daily values..."
              className="w-full h-[60px] text-lg px-6 pr-16 rounded-[50px] bg-transparent text-[#2c3e50] font-medium placeholder:text-[#7f8c8d] focus:outline-none" />
            <div className="absolute right-3 flex items-center justify-center w-10 h-10 rounded-full bg-[#F9A922] transition-transform hover:scale-110" style={{ boxShadow: "0 4px 12px rgba(249,169,34,0.3)" }}>
              <Search className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-center mt-2 text-white/90 text-sm font-medium">Access comprehensive nutritional reference values and daily requirements</p>
        </div>
      </div>

      <div className="px-4 py-6 max-w-[1200px] mx-auto">
        <h2 className="mb-3 font-bold text-[#333] text-2xl">European Vitamin, Mineral and Proximate Dietary Reference Values (DRV, NRV, RDA)</h2>
        <p className="mb-4 text-[#666] leading-relaxed">Dietary reference values (DRVs) is an umbrella term for a set of nutrient reference values (NRVs) that includes the average requirement (AR), the population reference intake (PRI), the adequate intake (AI) and the reference intake range for macronutrients (RI). These values guide professionals on the amount of a nutrient needed to maintain health in an otherwise healthy individual or group of people. DRVs also include the tolerable upper intake level (UL), which is the maximum amount of a nutrient that can be consumed safely over a long period of time.</p>
        <p className="mb-4 text-[#666] leading-relaxed">RDA's (Recommended Daily Allowance) were an old system and have now changed to NRV's. The values for RDA and NRV are exactly the same.</p>
        <p className="mb-6 text-[#666] leading-relaxed">Please contact our friendly and knowledgeable technical sales colleagues to help guide you to the best ingredients to allow you to achieve these recommended levels on your products.</p>

        <h3 className="mt-4 mb-3 font-bold text-[#333] text-xl">Daily Reference Intakes for Vitamins and Minerals (Adults)</h3>
        <h4 className="mb-2 font-bold text-[#555] text-lg">Vitamins</h4>
        <div className="overflow-x-auto mb-6 shadow-md rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead><tr><TH>Nutrient</TH><TH>EU NRV</TH><TH>Units (mg or mcg)</TH><TH>IU</TH><TH>Standardised Units (mg)</TH><TH>Tolerable Upper Intake Level (UL) mg</TH></tr></thead>
            <tbody>
              {[
                ["Vitamin A Retinol","800","mcg","2664iu","0.8","3"],
                ["Vitamin D Calciferol","5","mcg","200iu","0.005","0.1"],
                ["Vitamin E Tocopherol","12","mg","17.9iu","12","300"],
                ["Vitamin K1 Phylloquinone","75","mcg","","0.075","n/a"],
                ["Vitamin K2 Menaquinone","75","mcg","","0.075","n/a"],
                ["Vitamin B1 Thiamin","1.1","mg","","1.1","n/a"],
                ["Vitamin B2 Riboflavin","1.4","mg","","1.4","n/a"],
                ["Vitamin B3 Niacin","16","mg","","16","35"],
                ["Vitamin B5 Pantothenic Acid","6","mg","","6","n/a"],
                ["Vitamin B6 Pyridoxine","1.4","mg","","1.4","25"],
                ["Vitamin B7 Biotin","50","mcg","","0.05","n/a"],
                ["Vitamin B9 Folic Acid","200","mcg","","0.2","1"],
                ["Vitamin B12 Cobalamin","2.5","mcg","","0.0025","n/a"],
                ["Vitamin C Ascorbic Acid","80","mg","","80","2000"],
              ].map((r, i) => <tr key={i} className="border-b border-[#e8e8e8] hover:bg-gray-50">{r.map((c, j) => <TD key={j}>{c}</TD>)}</tr>)}
            </tbody>
          </table>
        </div>

        <h4 className="mb-2 font-bold text-[#555] text-lg">Minerals</h4>
        <div className="overflow-x-auto mb-6 shadow-md rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead><tr><TH>Nutrient</TH><TH>EU NRV</TH><TH>Units (mg or mcg)</TH><TH>IU</TH><TH>Standardised Units (mg)</TH><TH>Tolerable Upper Intake Level (UL) mg</TH></tr></thead>
            <tbody>
              {[
                ["Calcium","800","mg","","800","2500"],
                ["Chloride","800","mg","","800","n/a"],
                ["Chromium","40","mcg","","0.04","0.2"],
                ["Copper","5","mg","","1","5"],
                ["Fluoride","3.5","mg","","3.5","7"],
                ["Iodine","150","mcg","","0.15","0.6"],
                ["Iron","14","mg","","14","45"],
                ["Magnesium","375","mg","","375","450"],
                ["Manganese","2","mg","","2","11"],
                ["Molybdenum","50","mcg","","0.05","0.6"],
                ["Phosphorus","700","mg","","700","4000"],
                ["Potassium","2000","mg","","2000","n/a"],
                ["Selenium","55","mcg","","0.055","0.3"],
                ["Zinc","10","mg","","10","40"],
              ].map((r, i) => <tr key={i} className="border-b border-[#e8e8e8] hover:bg-gray-50">{r.map((c, j) => <TD key={j}>{c}</TD>)}</tr>)}
            </tbody>
          </table>
        </div>

        <h3 className="mt-4 mb-3 font-bold text-[#333] text-xl">Daily Reference Intakes for Energy and selected nutrients other than Vitamins and Minerals (Adults)</h3>
        <div className="overflow-x-auto mb-6 shadow-md rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead><tr><TH>Energy or Nutrient</TH><TH>Reference Intake</TH></tr></thead>
            <tbody>
              {[["Energy","2000 kcal"],["Energy","8400 kJ"],["Total fat","70 g"],["Saturates","20 g"],["Carbohydrate","260 g"],["Sugars","90 g"],["Protein","50 g"],["Salt","6 g"]]
                .map((r, i) => <tr key={i} className="border-b border-[#e8e8e8] hover:bg-gray-50"><TD>{r[0]}</TD><TD>{r[1]}</TD></tr>)}
            </tbody>
          </table>
        </div>

        <h3 className="mt-4 mb-3 font-bold text-[#333] text-xl">Conversion factors for the calculation of Energy</h3>
        <div className="overflow-x-auto mb-6 shadow-md rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead><tr><TH>Nutrient</TH><TH>Energy per g</TH></tr></thead>
            <tbody>
              {[
                ["Carbohydrate (except polyols)","17 kJ / 4 kcal"],["Polyols","10 kJ / 2.4 kcal"],["Protein","17 kJ / 4 kcal"],
                ["Fat","37 kJ / 9 kcal"],["Salatrims","25 kJ / 6 kcal"],["Alcohol (Ethanol)","29 kJ / 7 kcal"],
                ["Organic acid","13 kJ / 3 kcal"],["Fibre","8 kJ / 2 kcal"],["Erythritol","0 kJ / 0 kcal"],
              ].map((r, i) => <tr key={i} className="border-b border-[#e8e8e8] hover:bg-gray-50"><TD>{r[0]}</TD><TD>{r[1]}</TD></tr>)}
            </tbody>
          </table>
        </div>

        <h2 className="mt-6 mb-3 font-bold text-[#333] text-2xl">Navigating Nutrient Needs: A Guide to Vitamin and Mineral Safety in Pregnancy in Europe</h2>
        <p className="mb-4 text-[#666] leading-relaxed">Ensuring adequate nutrition is paramount during pregnancy for the health of both mother and child. While meeting dietary requirements is crucial, it is equally important to be aware of the upper safe limits of vitamins and minerals to avoid potential harm. In Europe, the European Food Safety Authority (EFSA) provides guidance on these limits.</p>
        <p className="mb-4 text-[#666] leading-relaxed">Below is a comprehensive table detailing the EU Nutrient Reference Values (NRV) for the general adult population, alongside the Tolerable Upper Intake Levels (UL) established by EFSA that are applicable to expectant mothers.</p>

        <h3 className="mt-4 mb-3 font-bold text-[#333] text-xl">Key Recommendations for Pregnancy:</h3>
        <div className="mb-4 flex flex-col gap-2">
          <p className="text-[#666] leading-relaxed"><strong>Folic Acid:</strong> Supplementation is crucial. It is recommended to take 400 µg of folic acid daily before conception and until the 12th week of pregnancy to reduce the risk of neural tube defects. In some cases, a higher dose may be prescribed.</p>
          <p className="text-[#666] leading-relaxed"><strong>Vitamin D:</strong> A daily supplement of 10 µg is recommended throughout pregnancy and breastfeeding, as it is difficult to obtain sufficient amounts from diet and sunlight alone.</p>
          <p className="text-[#666] leading-relaxed"><strong>Vitamin A (Retinol):</strong> High doses of Vitamin A can be teratogenic (cause birth defects). Therefore, pregnant individuals should avoid supplements containing high levels of vitamin A and limit consumption of liver and liver products.</p>
          <p className="text-[#666] leading-relaxed"><strong>Iron:</strong> While essential, the need for iron increases significantly during pregnancy and postnatally. However, any high-dose supplementation should only be taken under medical supervision, as excessive iron can cause gastrointestinal issues.</p>
        </div>

        <div className="mt-6 mb-4 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg p-4">
          <p className="text-[#666] text-sm leading-relaxed italic">All information is correct to the best of our knowledge and Nutraceuticals Group Europe takes no responsibility for any errors or mistakes. Links to other sources and reference material are included for accuracy. Any errors or omissions? Please let us know through our contact form.</p>
        </div>
        <CompanyContactInfo />
      </div>
    </div>
  );
}
