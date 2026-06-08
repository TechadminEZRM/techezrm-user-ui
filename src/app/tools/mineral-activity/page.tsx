import React from "react";
import { Search } from "lucide-react";
import CompanyContactInfo from "@/components/CompanyContactInfo";

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="font-bold text-left p-3 text-sm border-b border-[#e8e8e8] bg-[#f5f5f5]">{children}</th>
);
const TD = ({ children }: { children: React.ReactNode }) => (
  <td className="p-3 text-sm text-[#333]">{children}</td>
);

export default function MineralActivityPage() {
  return (
    <div className="min-h-screen">
      <div className="w-full py-64 flex flex-col justify-center items-center relative"
        style={{ backgroundImage: "url('https://nutraceuticalsgroup.com/images/mainImage.webp')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-[2] text-center mb-6">
          <h1 className="font-bold text-white text-[clamp(2.5rem,5vw,4rem)] mb-2 tracking-[0.02em]" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>Mineral Activity</h1>
          <p className="text-white/90 font-normal text-lg md:text-xl" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>Solubility in Water &amp; Elemental Composition Database</p>
        </div>
        <div className="relative z-[2] w-[90%] max-w-[700px]">
          <div className="relative flex items-center bg-white/95 backdrop-blur-[15px] rounded-[50px]" style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)" }}>
            <input placeholder="Search minerals, solubility, elemental composition, or specifications..."
              className="w-full h-[60px] text-lg px-6 pr-16 rounded-[50px] bg-transparent text-[#2c3e50] font-medium placeholder:text-[#7f8c8d] focus:outline-none" />
            <div className="absolute right-3 flex items-center justify-center w-10 h-10 rounded-full bg-[#F9A922] transition-transform hover:scale-110" style={{ boxShadow: "0 4px 12px rgba(249,169,34,0.3)" }}>
              <Search className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-center mt-2 text-white/90 text-sm font-medium">Access comprehensive mineral solubility and elemental composition data</p>
        </div>
      </div>

      <div className="px-4 py-6 max-w-[1200px] mx-auto">
        <h2 className="mb-3 font-bold text-[#333] text-2xl">Mineral Activity and Solubility in Water</h2>
        <p className="mb-4 text-[#666] leading-relaxed">Elemental composition table for minerals. NB: Data here is lower or average values from calculated or published data and should be used as a guide only. Please contact our friendly and knowledgeable technical sales colleagues to help guide you to the best ingredients to allow you to achieve your desired mineral levels for your products.</p>

        <h3 className="mt-4 mb-3 font-bold text-[#333] text-xl">Mineral Activity and Solubility Database</h3>
        <div className="overflow-x-auto mb-6 shadow-md rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead><tr><TH>Item Code</TH><TH>Item Name</TH><TH>Main Activity %</TH><TH>Main Active Ingredient#1</TH><TH>Sub Activity %</TH><TH>Sub Active Ingredient#2</TH><TH>Solubility / Extraction</TH></tr></thead>
            <tbody>
              {[
                ["NIGEMIN000089","Boron 1% Food State On Yeast (Fungus) (Soya) (~1% B)","1.00%","Boron","","",""],
                ["NIGEMIN000081","Disodium Tetraborate Decahydrate Nutrition Grade (Borax) (Boron) (~11% B)","11.34%","Boron","12.06%","Sodium","Soluble in water"],
                ["NIGEMIN001073","Calcium 5% Food State On Yeast (Fungus) (Soya) (~5% Ca)","5.00%","Calcium","","",""],
                ["NIGEMIN000095","Calcium Alpha Ketoglutarate (Oxoglutarate) Nutrition Grade (~19.5% Ca)","19.50%","Calcium","","",""],
                ["NIGEMIN000101","Calcium Aspartate Chelate Nutrition Grade (~12% Ca)","12.50%","Calcium","","","Soluble in water"],
                ["NIGEMIN000654","Calcium Bisglycinate Chelate Buffered Nutrition Grade (~30% Ca)","30.00%","Calcium","","",""],
                ["NIGEMIN000651","Calcium Bisglycinate Chelate Nutrition Grade (~19% Ca)","19.00%","Calcium","","","Soluble in water"],
                ["NIGEMIN000241","Calcium Caprylate (Calcium Octanoate) Powder Nutrition Grade (~12% Ca)","12.00%","Calcium","","","Insoluble in water"],
                ["NIGEMIN000211","Calcium Carbonate DC (<5% Maltodextrin) Nutrition Grade (~36% Ca)","36.00%","Calcium","","","Insoluble in water"],
                ["NIGEMIN000203","Calcium Carbonate Nutrition Grade 1250 Mesh (~40% Ca)","40.00%","Calcium","","","Insoluble in water"],
                ["NIGEMIN000421","Calcium Chloride Dihydrate Nutrition Grade (~27% Ca)","27.00%","Calcium","48.00%","Chlorine","Soluble in water"],
                ["NIGEMIN000401","Calcium Citrate Malate Granular Nutrition Grade (~20% Ca)","20.50%","Calcium","","","Insoluble at 1330mg in 200ml water ~266mg Elemental 33% RDA"],
                ["NIGEMIN000301","Calcium Citrate Tetrahydrate Nutrition Grade (~19% Ca)","19.00%","Calcium","","","Insoluble in water"],
                ["NIGEMIN000611","Calcium Fructoborate (~5% Ca ~2.5% B)","5.00%","Calcium","2.50%","Boron",""],
                ["NIGEMIN000601","Calcium Gluconate Nutrition Grade (~8% Ca)","8.94%","Calcium","","","Soluble in water"],
                ["NIGEMIN000621","Calcium Glycerophosphate Nutrition Grade (~18% Ca)","18.60%","Calcium","","","Soluble in water"],
                ["NIGEMIN004112","Calcium Hydrogen Phosphate Dihydrate Nutrition Grade (~23% Ca)","23.29%","Calcium","18.00%","Phosphorus",""],
                ["NIGEMIN000655","Calcium Hydroxide Nutrition Grade (~51% Ca)","51.80%","Calcium","","","Insoluble in water"],
                ["NIGEMIN000658","Calcium Iodate Nutrition Grade (~61% Iodate)","10.00%","Calcium","61.00%","Iodine",""],
                ["NIGEMIN000661","Calcium Ketoisocaproate (KIC Calcium) Nutrition Grade (~13% Ca)","13.40%","Calcium","","","Slightly soluble in water"],
                ["NIGEMIN000705","Calcium Lactate Anhydrous Nutrition Grade (~18% Ca)","18.00%","Calcium","","",""],
                ["NIGEMIN000701","Calcium Lactate Pentahydrate Nutrition Grade (~13% Ca)","13.40%","Calcium","","","Slightly soluble in water"],
                ["NIGEMIN000751","Calcium Magnesium Carbonate (Dolomite) Nutrition Grade (21% Ca 13% Mg)","21.70%","Calcium","13.10%","Magnesium",""],
                ["NIGEMIN000801","Calcium Malate Nutrition Grade (~23% Ca)","23.28%","Calcium","","","Slightly Soluble in water"],
                ["NIGEMIN000901","Calcium Pyruvate Nutrition Grade (~15% Ca)","15.00%","Calcium","","","Soluble in water"],
                ["NIGEMIN000951","Calcium Silicate Nutrition Grade (~34% Ca)","34.50%","Calcium","65.60%","Silicon",""],
                ["NIGEMIN001001","Calcium Succinate Nutrition Grade (~25% Ca)","25.67%","Calcium","","","Insoluble in water"],
                ["NIGEMIN001010","Calcium Sulphate Anhydrous Nutrition Grade (~29% Ca)","29.44%","Calcium","23.55%","Sulphur","Slightly soluble in water"],
                ["NIGEMIN001020","Calcium Sulphate Dihydrate (Gypsum) Nutrition Grade (~23% Ca)","23.27%","Calcium","18.62%","Sulphur","Slightly soluble in water"],
                ["NIGEMIN001110a","Chromium 1% Food State On Buckwheat (~1% Cr)","1.00%","Chromium","2.04%","Chlorine",""],
                ["NIGEMIN001085","Chromium Chloride Encapsulated Nutrition Grade (~2% Cr)","2.00%","Chromium","34.00%","Calcium",""],
                ["NIGEMIN001100","Chromium Chloride Hexahydrate Nutrition Grade (~19% Cr)","19.13%","Chromium","39.00%","Chlorine","Soluble in water"],
                ["NIGEMIN001101","Chromium Picolinate Nutrition Grade (~12% Cr)","12.43%","Chromium","","","Insoluble in water"],
                ["NIGEMIN001325","Copper 1% Food State On Yeast (Fungus) (Soya) (~1% Cu)","1.00%","Copper","","",""],
                ["NIGEMIN001111","Copper Aspartate Chelate Nutrition Grade (~12% Cu)","12.00%","Copper","","","Slightly soluble in water"],
                ["NIGEMIN001201","Copper Bisglycinate Chelate Nutrition Grade (~29% Cu)","29.00%","Copper","","","Slightly soluble in water"],
                ["NIGEMIN001211","Copper Citrate Hemitrihydrate Powder Nutrition Grade (~36% Cu)","36.00%","Copper","","","Soluble in water"],
                ["NIGEMIN001301","Copper Gluconate Anhydrous Nutrition Grade (~13% Cu)","13.00%","Copper","","","Soluble in water"],
                ["NIGEMIN001305","Copper Oxide Nutrition Grade (~78% Cu)","78.70%","Copper","","","Insoluble in water"],
                ["NIGEMIN001315","Copper Sulphate Anhydrous Nutrition Grade (~39% Cu)","39.81%","Copper","","","Soluble in water"],
                ["NIGEMIN001311","Copper Sulphate Pentahydrate Nutrition Grade (~25% Cu)","25.45%","Copper","","","Soluble in water"],
                ["NIGEMIN001636","Carbonyl Iron Powder Nutrition Grade (~99% Fe)","99.50%","Iron","","","Soluble in water"],
                ["NIGEMIN001631","Ferric (Iron III) Pyrophosphate Nutrition Grade (~25% Fe)","25.00%","Iron","21.00%","Phosphorus","Insoluble in water"],
                ["NIGEMIN001505","Ferrous (Iron II) Bisglycinate Chelate Liposomal Powder Nutrition Grade (~7% Fe)","7.00%","Iron","","","Soluble in water"],
                ["NIGEMIN001501","Ferrous (Iron II) Bisglycinate Chelate Nutrition Grade (~18% Fe)","18.00%","Iron","","","Soluble in water"],
                ["NIGEMIN001551","Ferrous (Iron II) Citrate Nutrition Grade (~20% Fe)","20.00%","Iron","","","Soluble in water"],
                ["NIGEMIN001611","Ferrous (Iron II) Fumarate Nutrition Grade (~33% Fe)","33.00%","Iron","","","Soluble in water"],
                ["NIGEMIN001601","Ferrous (Iron II) Gluconate Nutrition Grade (~11% Fe)","11.80%","Iron","","","Slightly soluble in water"],
                ["NIGEMIN001615","Ferrous (Iron II) Lactate Dihydrate Nutrition Grade (~19% Fe)","19.00%","Iron","","","Soluble in water"],
                ["NIGEMIN001621","Ferrous (Iron II) Sulphate Dried Nutrition Grade (~32% Fe)","32.50%","Iron","21.00%","Sulphur","Soluble in water"],
                ["NIGEMIN001624","Ferrous (Iron II) Sulphate Heptahydrate Nutrition Grade (~20% Fe)","20.10%","Iron","11.53%","Sulphur","Soluble in water"],
                ["NIGEMIN001634","Reduced Iron Powder Nutrition Grade (~97% Fe)","97.00%","Iron","","",""],
                ["NIGEMIN002850","Magnesium 5% Food State On Yeast (Fungus) (Soya) (~5% Mg)","5.00%","Magnesium","","",""],
                ["NIGEMIN002424a","Magnesium Acetyl Taurate Nutrition Grade (~6% Mg)","6.00%","Magnesium","","","Soluble in water"],
                ["NIGEMIN002402","Magnesium Bisglycinate Anhydrous Chelate Fully Reacted Nutrition Grade (~13% Mg)","13.00%","Magnesium","","","Insoluble in water"],
                ["NIGEMIN002411","Magnesium Bisglycinate Chelate Buffered Nutrition Grade (~20% Mg)","20.00%","Magnesium","","","Insoluble in water"],
                ["NIGEMIN002001","Magnesium Chloride Anhydrous (~25% Mg)","25.50%","Magnesium","74.40%","Chlorine","Soluble in water"],
                ["NIGEMIN002000","Magnesium Chloride Hexahydrate Nutrition Grade (~11% Mg)","11.96%","Magnesium","34.80%","Chlorine","Soluble in water"],
                ["NIGEMIN002210","Magnesium Citrate 30% Buffered Nutrition Grade (~30% Mg)","30.00%","Magnesium","","","Insoluble in water"],
                ["NIGEMIN002207","Magnesium Citrate Nonahydrate Nutrition Grade (~11% Mg)","11.20%","Magnesium","","","Slightly soluble in water"],
                ["NIGEMIN002301","Magnesium Gluconate Nutrition Grade (~5% Mg)","5.86%","Magnesium","","","Insoluble in water"],
                ["NIGEMIN002421","Magnesium Glycerophosphate Nutrition Grade (~10% Mg)","10.50%","Magnesium","","","Soluble in water"],
                ["NIGEMIN002423","Magnesium Hydroxide Nutrition Grade (~41% Mg)","41.60%","Magnesium","","","Insoluble in water"],
                ["NIGEMIN002501","Magnesium Lactate Dihydrate Nutrition Grade (~10% Mg)","10.19%","Magnesium","","","Soluble in water"],
                ["NIGEMIN002601","Magnesium Malate Anhydrous Nutrition Grade (~14% Mg)","14.00%","Magnesium","","","Slightly soluble in water"],
                ["NIGEMIN002715","Magnesium Oxide DC Granular Nutrition Grade (~60% Mg)","60.30%","Magnesium","","","Insoluble in water"],
                ["NIGEMIN002811","Magnesium Sulphate Heptahydrate (Epsom Salts) Nutrition Grade (~9% Mg)","9.86%","Magnesium","13.01%","Sulphur","Soluble in water"],
                ["NIGEMIN002424","Magnesium Taurate Nutrition Grade (~8% Mg)","8.92%","Magnesium","","","Soluble in water"],
                ["NIGEMIN004405a","Zinc 1.5% Food State On Buckwheat (~1.5% Zn)","1.50%","Zinc","","",""],
                ["NIGEMIN004505","Zinc 5% Food State On Yeast (Fungus) (Soya) (~5% Zn)","5.00%","Zinc","","",""],
                ["NIGEMIN004301","Zinc Acetate Nutrition Grade (~29% Zn)","29.70%","Zinc","","","Insoluble in water"],
                ["NIGEMIN004315","Zinc Bisglycinate Chelate Nutrition Grade (~20% Zn)","20.00%","Zinc","","","Slightly soluble in water"],
                ["NIGEMIN004401","Zinc Citrate Dihydrate Nutrition Grade (~31% Zn)","31.21%","Zinc","","","Soluble in water"],
                ["NIGEMIN004501","Zinc Gluconate Powder Nutrition Grade (~13% Zn)","13.40%","Zinc","","","Soluble in water"],
                ["NIGEMIN004551","Zinc Lactate Dihydrate Nutrition Grade (~22% Zn)","22.00%","Zinc","","","Slightly soluble in water"],
                ["NIGEMIN004701","Zinc Monomethionine (Zinc Methionate) Nutrition Grade (~18% Zn)","18.00%","Zinc","","","Insoluble in water"],
                ["NIGEMIN004805","Zinc Orotate Nutrition Grade (~14% Zn)","14.30%","Zinc","","","Slightly soluble in water"],
                ["NIGEMIN004802","Zinc Oxide Nutrition Grade 30 Mesh (~80% Zn)","80.35%","Zinc","","","Soluble in water"],
                ["NIGEMIN004811","Zinc Picolinate Nutrition Grade (~20% Zn)","20.00%","Zinc","","","Soluble in water"],
                ["NIGEMIN004821","Zinc Sulphate Monohydrate Nutrition Grade (~35% Zn)","35.50%","Zinc","","","Soluble in water"],
              ].map((r, i) => <tr key={i} className="border-b border-[#e8e8e8] hover:bg-gray-50">{r.map((c, j) => <TD key={j}>{c}</TD>)}</tr>)}
            </tbody>
          </table>
        </div>

        <div className="mt-6 mb-4 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg p-4">
          <p className="text-[#666] text-sm leading-relaxed italic">All information is correct to the best of our knowledge and Nutraceuticals Group Europe takes no responsibility for any errors or mistakes. Links to other sources and reference material are included for accuracy. Any errors or omissions? Please let us know through our contact form.</p>
        </div>
        <CompanyContactInfo />
      </div>
    </div>
  );
}
