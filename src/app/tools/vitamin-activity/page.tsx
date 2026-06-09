import React from "react";
import { Search } from "lucide-react";
import CompanyContactInfo from "@/components/CompanyContactInfo";

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="font-bold text-left p-3 text-sm border-b border-line-light bg-paper">{children}</th>
);
const TD = ({ children }: { children: React.ReactNode }) => (
  <td className="p-3 text-sm text-body">{children}</td>
);

export default function VitaminActivityPage() {
  return (
    <div className="min-h-screen">
      <div className="w-full py-64 flex flex-col justify-center items-center relative"
        style={{ backgroundImage: "url('https://nutraceuticalsgroup.com/images/mainImage.webp')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-[2] text-center mb-6">
          <h1 className="font-bold text-white text-[clamp(2.5rem,5vw,4rem)] mb-2 tracking-[0.02em]" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>Vitamin Activity</h1>
          <p className="text-white/90 font-normal text-lg md:text-xl" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>Composition &amp; Activity Database</p>
        </div>
        <div className="relative z-[2] w-[90%] max-w-[700px]">
          <div className="relative flex items-center bg-white/95 backdrop-blur-[15px] rounded-[50px]" style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)" }}>
            <input placeholder="Search vitamins, activity levels, composition, or specifications..."
              className="w-full h-[60px] text-lg px-6 pr-16 rounded-[50px] bg-transparent text-heading font-medium placeholder:text-soft focus:outline-none" />
            <div className="absolute right-3 flex items-center justify-center w-10 h-10 rounded-full bg-brand transition-transform hover:scale-110" style={{ boxShadow: "0 4px 12px rgba(249,169,34,0.3)" }}>
              <Search className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-center mt-2 text-white/90 text-sm font-medium">Access comprehensive vitamin composition and activity data</p>
        </div>
      </div>

      <div className="px-4 py-6 max-w-[1200px] mx-auto">
        <h2 className="mb-3 font-bold text-body text-2xl">Vitamin Activity and Composition</h2>
        <p className="mb-4 text-dim leading-relaxed">Composition table for vitamins. NB: Data here is lower or average values from calculated or published data and should be used as a guide only. Please contact our friendly and knowledgeable technical sales colleagues to help guide you to the best ingredients to allow you to achieve your desired vitamin levels for your products.</p>

        <h3 className="mt-4 mb-3 font-bold text-body text-xl">Vitamin Activity and Composition Database</h3>
        <div className="overflow-x-auto mb-6 shadow-md rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead><tr><TH>Item Code</TH><TH>Item Name</TH><TH>Main Activity %</TH><TH>Main Active Ingredient#1</TH><TH>Sub Activity %</TH><TH>Sub Active Ingredient#2</TH></tr></thead>
            <tbody>
              {[
                ["NIGEVIT001111","Vitamin B1 Benfotiamine","100.00%","Benfotiamine","",""],
                ["NIGEVIT001109","Vitamin B1 Thiamine 25% Food State On Yeast (Fungus) (Soya)","79.67%","Vitamin B1 (Thiamine)","",""],
                ["NIGEVIT001001","Vitamin B1 Thiamine HCL","78.74%","Vitamin B1 (Thiamine)","",""],
                ["NIGEVIT001101","Vitamin B1 Thiamine Mononitrate","81.30%","Vitamin B1 (Thiamine)","",""],
                ["NIGEVIT001511","Vitamin B2 Riboflavin 10% Food State On Yeast (Fungus) (Soya)","10.00%","Vitamin B2 (Riboflavin)","",""],
                ["NIGEVIT001501","Vitamin B2 Riboflavin","100.00%","Vitamin B2 (Riboflavin)","",""],
                ["NIGEVIT001601","Vitamin B2 Riboflavin 5-Phosphate Sodium (R5P)","73.00%","Vitamin B2 (Riboflavin)","",""],
                ["NIGEVIT000521","Vitamin B3 (Non Flush) Inositol Hexanicotinate","80.00%","Vitamin B3 (Niacin)","20.00%","Inositol"],
                ["NIGEVIT001701","Vitamin B3 Nicotinamide (Niacinamide Vitamin PP)","100.00%","Vitamin B3 (Niacin)","",""],
                ["NIGEVIT001702","Vitamin B3 Nicotinic Acid (Niacin Vitamin PP) - May cause Flushing","100.00%","Vitamin B3 (Niacin)","",""],
                ["NIGEVIT001801","Vitamin B5 Calcium Pantothenate (Calpan) 45 Mesh","92.00%","Vitamin B5 (Pantothenate)","",""],
                ["NIGEVIT001806","Vitamin B5 D-Panthenol 75% Liquid","79.79%","Vitamin B5 (Pantothenate)","",""],
                ["NIGEVIT001808","Vitamin B5 D-Pantethine 40%","40.00%","Pantethine","",""],
                ["NIGEVIT001901","Vitamin B6 Pyridoxal 5-Phosphate Monohydrate (P5P)","67.22%","Vitamin B6 (Pyridoxine)","",""],
                ["NIGEVIT002001","Vitamin B6 Pyridoxine HCl 40 Mesh","82.00%","Vitamin B6 (Pyridoxine)","",""],
                ["NIGEVIT002101","Vitamin B7 D-Biotin (Vitamin H) 100%","100.00%","Vitamin B7 (Biotin)","",""],
                ["NIGEVIT002102","Vitamin B7 D-Biotin (Vitamin H) 1% On Dicalcium Phosphate","1.00%","Vitamin B7 (Biotin)","",""],
                ["NIGEVIT002301","Vitamin B9 Folic Acid (Folacin / Folate) 350 Mesh","100.00%","Vitamin B9 (Folate)","",""],
                ["NIGEVIT002211","Vitamin B9 L-5-Methyltetrahydrofolate Calcium MTHF Crystalline Stabilised 1%","0.75%","MTHF","1.27%","Vitamin B9 (Folate)"],
                ["NIGEVIT001200","Vitamin B12 Cyanocobalamin 1% (on Dicalcium Phosphate)","1.00%","Vitamin B12 (Cobalamin)","",""],
                ["NIGEVIT001203","Vitamin B12 Cyanocobalamin Pure 100%","100.00%","Vitamin B12 (Cobalamin)","",""],
                ["NIGEVIT001398","Vitamin B12 Methylcobalamin (Mecobalamin) 1% (On Maltodextrin)","1.00%","Vitamin B12 (Cobalamin)","",""],
                ["NIGEVIT002401","Vitamin C Ascorbic Acid","100.00%","Vitamin C (Ascorbate)","",""],
                ["NIGEVIT002501","Vitamin C Calcium Ascorbate Dihydrate (~82% Ascorbate)","81.97%","Vitamin C (Ascorbate)","9.00%","Calcium"],
                ["NIGEVIT002605","Vitamin C Magnesium Ascorbate Anhydrous (~80% Ascorbate)","80.00%","Vitamin C (Ascorbate)","5.00%","Magnesium"],
                ["NIGEVIT002701","Vitamin C Sodium Ascorbate (~88% Ascorbate)","88.50%","Vitamin C (Ascorbate)","11.00%","Sodium"],
                ["NIGEVIT002801","Vitamin D2 Ergocalciferol Powder 0.25% 2500ug/g 100000iu/g Synthetic Vegan","0.25%","Vitamin D (Calciferol)","",""],
                ["NIGEVIT002802","Vitamin D2 Ergocalciferol Powder Pure 1000000ug/g 40000000iu/g Synthetic Vegan","100.00%","Vitamin D (Calciferol)","",""],
                ["NIGEVIT002920","Vitamin D3 Cholecalciferol Crystals Pure 1000000ug/g 40000000iu/g Vegetarian (Wool Lanolin)","98.00%","Vitamin D (Calciferol)","",""],
                ["NIGEVIT002905","Vitamin D3 Cholecalciferol Oil 10% 100000ug/g 4000000iu/g Vegetarian (Wool Lanolin)","10.00%","Vitamin D (Calciferol)","",""],
                ["NIGEVIT003201","Vitamin E Mixed Natural Tocopherol Oil 95% Non-GMO","95.00%","Vitamin E (Tocopherol)","",""],
                ["NIGEVIT003301","Vitamin E Mixed Natural Tocopherol Powder 30% Non-GMO","30.00%","Vitamin E (Tocopherol)","",""],
                ["NIGEVIT003401","Vitamin E Natural (D-Alpha-Tocopheryl Acetate 51.5% 700iu/g) Powder CWD Non-GMO","46.99%","Vitamin E (Tocopherol)","",""],
                ["NIGEVIT003601","Vitamin K1 (Phylloquinone / Phytomenadione / Phytonadione) 1% Powder","1.00%","Vitamin K1 (Phylloquinone)","",""],
                ["NIGEVIT003610","Vitamin K1 (Phylloquinone / Phytomenadione / Phytonadione) 20% Powder","20.00%","Vitamin K1 (Phylloquinone)","",""],
                ["NIGEVIT003828","Vitamin K2 Menaquinone-7 (MK7) 1.0% Powder Fermented Trans Vegan","1.00%","Vitamin K2 (Menaquinone)","",""],
                ["NIGEVIT003830","Vitamin K2 Menaquinone-7 (MK7) 5.0% Powder Fermented Trans Vegan","5.00%","Vitamin K2 (Menaquinone)","",""],
                ["NIGEVIT000960","Beta Carotene 1% Beadlet Synthetic","0.17%","Vitamin A (Retinol)","1.00%","Beta Carotene"],
                ["NIGEVIT000913","Beta Carotene 10% Beadlet Synthetic","1.67%","Vitamin A (Retinol)","10.00%","Beta Carotene"],
                ["NIGEVIT000918","Beta Carotene 20% Beadlet Synthetic","3.33%","Vitamin A (Retinol)","20.00%","Beta Carotene"],
                ["NIGEVIT000831","Vitamin A Acetate (Retinol) - Crystalline 2800000IU/G","84.00%","Vitamin A (Retinol)","",""],
                ["NIGEVIT000821","Vitamin A Acetate (Retinol) - Oil 1000000IU/G","30.00%","Vitamin A (Retinol)","",""],
                ["NIGEVIT000601","Vitamin A Acetate (Retinol) - Powder 250000IU/G","7.50%","Vitamin A (Retinol)","",""],
                ["NIGEVIT000221","Choline 25% Food State On Yeast (Fungus) (Soya)","25.00%","Choline","",""],
                ["NIGEVIT000101","DL-Choline Bitartrate","41.00%","Choline","100.00%","DL-Choline Bitartrate"],
                ["NIGEVIT000301","Coenzyme Q10 CoQ10 Powder 100% (Ubiquinone / Ubidecarenone)","100.00%","Coenzyme Q10","",""],
                ["NIGEVIT000501","Inositol (Myo-Inositol)","100.00%","Inositol","",""],
              ].map((r, i) => <tr key={i} className="border-b border-line-light hover:bg-gray-50">{r.map((c, j) => <TD key={j}>{c}</TD>)}</tr>)}
            </tbody>
          </table>
        </div>

        <div className="mt-6 mb-4 bg-surface border border-line rounded-lg p-4">
          <p className="text-dim text-sm leading-relaxed italic">All information is correct to the best of our knowledge and Nutraceuticals Group Europe takes no responsibility for any errors or mistakes. Links to other sources and reference material are included for accuracy. Any errors or omissions? Please let us know through our contact form.</p>
        </div>
        <CompanyContactInfo />
      </div>
    </div>
  );
}
