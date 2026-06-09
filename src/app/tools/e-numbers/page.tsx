import React from "react";
import { Search } from "lucide-react";
import CompanyContactInfo from "@/components/CompanyContactInfo";

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="font-bold text-left p-3 text-sm border-b border-line-light bg-paper">{children}</th>
);
const TD = ({ children }: { children: React.ReactNode }) => (
  <td className="p-3 text-sm text-body">{children}</td>
);

export default function ENumbersPage() {
  return (
    <div className="min-h-screen">
      <div className="w-full py-64 flex flex-col justify-center items-center relative"
        style={{ backgroundImage: "url('https://nutraceuticalsgroup.com/images/mainImage.webp')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-[2] text-center mb-6">
          <h1 className="font-bold text-white text-[clamp(2.5rem,5vw,4rem)] mb-2 tracking-[0.02em]" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>E Numbers</h1>
          <p className="text-white/90 font-normal text-lg md:text-xl" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>Food Additives &amp; Nutritional Information Database</p>
        </div>
        <div className="relative z-[2] w-[90%] max-w-[700px]">
          <div className="relative flex items-center bg-white/95 backdrop-blur-[15px] rounded-[50px]" style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)" }}>
            <input placeholder="Search E Numbers, additives, or food ingredients..."
              className="w-full h-[60px] text-lg px-6 pr-16 rounded-[50px] bg-transparent text-heading font-medium placeholder:text-soft focus:outline-none" />
            <div className="absolute right-3 flex items-center justify-center w-10 h-10 rounded-full bg-brand transition-transform hover:scale-110" style={{ boxShadow: "0 4px 12px rgba(249,169,34,0.3)" }}>
              <Search className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-center mt-2 text-white/90 text-sm font-medium">Discover food additives, preservatives, and nutritional information</p>
        </div>
      </div>

      <div className="px-4 py-6 max-w-[1200px] mx-auto">
        <h2 className="mb-3 font-bold text-body text-2xl">E-Numbers</h2>
        <div className="overflow-x-auto mb-6 shadow-md rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead><tr><TH>E-Number</TH><TH>Additive Name</TH><TH>Item Code</TH><TH>Item Name</TH><TH>Also known as</TH></tr></thead>
            <tbody>
              {[
                ["E100","Curcumin","100-000-000","Curcumin 95% (Turmeric Extract)","Turmeric"],
                ["E101","Riboflavin","101-000-000","Riboflavin (Vitamin B2)","Vitamin B2"],
                ["E102","Tartrazine","102-000-000","Tartrazine","FD&C Yellow 5"],
                ["E120","Cochineal","120-000-000","Cochineal Extract (Carmine)","Carmine"],
                ["E150a","Plain caramel","150A-000-000","Caramel Colour (Plain)","Caramel I"],
                ["E160a","Carotenes","160A-000-000","Beta Carotene 10% CWS","Beta Carotene"],
                ["E171","Titanium dioxide","171-000-000","Titanium Dioxide","TiO2"],
                ["E202","Potassium sorbate","202-000-000","Potassium Sorbate","Potassium salt of sorbic acid"],
                ["E211","Sodium benzoate","211-000-000","Sodium Benzoate","Sodium salt of benzoic acid"],
                ["E223","Sodium metabisulphite","223-000-000","Sodium Metabisulphite","Sodium Metabisulfite"],
                ["E250","Sodium nitrite","250-000-000","Sodium Nitrite","NaNO2"],
                ["E260","Acetic acid","260-000-000","Acetic Acid","Ethanoic acid"],
                ["E290","Carbon dioxide","290-000-000","Carbon Dioxide","CO2"],
                ["E300","Ascorbic acid","300-000-000","Ascorbic Acid (Vitamin C)","Vitamin C"],
                ["E322","Lecithins","322-000-000","Soy Lecithin","Phosphatidylcholine"],
                ["E330","Citric acid","330-000-000","Citric Acid","2-Hydroxy-1,2,3-propanetricarboxylic acid"],
                ["E341","Calcium phosphates","341-000-000","Calcium Phosphate","Tricalcium phosphate"],
                ["E400","Alginic acid","400-000-000","Alginic Acid","Polymannuronic acid"],
                ["E415","Xanthan gum","415-000-000","Xanthan Gum","Corn sugar gum"],
                ["E422","Glycerol","422-000-000","Glycerol","Glycerin"],
                ["E440","Pectins","440-000-000","Pectin","Polysaccharide"],
                ["E450","Diphosphates","450-000-000","Disodium Diphosphate","Sodium pyrophosphate"],
                ["E466","Carboxymethylcellulose","466-000-000","Carboxymethylcellulose","CMC"],
                ["E471","Mono- and diglycerides of fatty acids","471-000-000","Glyceryl Monostearate","GMS"],
                ["E481","Sodium stearoyl-2-lactylate","481-000-000","Sodium Stearoyl Lactylate","SSL"],
              ].map((r, i) => <tr key={i} className="border-b border-line-light hover:bg-gray-50">{r.map((c, j) => <TD key={j}>{c}</TD>)}</tr>)}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 font-bold text-body text-2xl">Preservatives</h2>
        <div className="overflow-x-auto mb-6 shadow-md rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead><tr><TH>Preservatives</TH><TH>Item Code</TH><TH>Item Name</TH></tr></thead>
            <tbody>
              {[["Benzoic Acid","BENZ-000-000","Benzoic Acid"],["Potassium Sorbate","POTS-000-000","Potassium Sorbate"],["Sodium Benzoate","SOBE-000-000","Sodium Benzoate"],["Sorbic Acid","SORB-000-000","Sorbic Acid"],["Sulphur Dioxide","SULD-000-000","Sulphur Dioxide"]]
                .map((r, i) => <tr key={i} className="border-b border-line-light hover:bg-gray-50">{r.map((c, j) => <TD key={j}>{c}</TD>)}</tr>)}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 font-bold text-body text-2xl">Antioxidants</h2>
        <div className="overflow-x-auto mb-6 shadow-md rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead><tr><TH>Antioxidants</TH><TH>Item Code</TH><TH>Item Name</TH></tr></thead>
            <tbody>
              {[["Ascorbic Acid","ASCO-000-000","Ascorbic Acid (Vitamin C)"],["BHA","BHA-000-000","Butylated Hydroxyanisole"],["Mixed Tocopherols","MIXT-000-000","Mixed Tocopherols (Natural Vitamin E)"],["TBHQ","TBHQ-000-000","Tertiary-butylhydroquinone"]]
                .map((r, i) => <tr key={i} className="border-b border-line-light hover:bg-gray-50">{r.map((c, j) => <TD key={j}>{c}</TD>)}</tr>)}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 font-bold text-body text-2xl">Acidity Regulators, Anti-caking, Humectants and Raising Agents</h2>
        <div className="overflow-x-auto mb-6 shadow-md rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead><tr><TH>Acidity Regulators, Anti-caking, Humectants and Raising Agents</TH><TH>Item Code</TH><TH>Item Name</TH></tr></thead>
            <tbody>
              {[["Acetic Acid","ACET-000-000","Acetic Acid"],["Calcium Carbonate","CALC-000-000","Calcium Carbonate"],["Citric Acid","CITR-000-000","Citric Acid"],["Magnesium Oxide","MAGO-000-000","Magnesium Oxide"],["Sodium Bicarbonate","SOBI-000-000","Sodium Bicarbonate"],["Tartaric Acid","TART-000-000","Tartaric Acid"]]
                .map((r, i) => <tr key={i} className="border-b border-line-light hover:bg-gray-50">{r.map((c, j) => <TD key={j}>{c}</TD>)}</tr>)}
            </tbody>
          </table>
        </div>

        <CompanyContactInfo />
      </div>
    </div>
  );
}
