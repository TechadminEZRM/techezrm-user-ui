import React from "react";
import { Search } from "lucide-react";
import CompanyContactInfo from "@/components/CompanyContactInfo";

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="font-bold text-left p-3 text-sm border-b border-[#e8e8e8] bg-[#f5f5f5]">{children}</th>
);
const TD = ({ children }: { children: React.ReactNode }) => (
  <td className="p-3 text-sm text-[#333] align-top">{children}</td>
);

export default function EnzymeApplicationsPage() {
  return (
    <div className="min-h-screen">
      <div className="w-full py-64 flex flex-col justify-center items-center relative"
        style={{ backgroundImage: "url('https://nutraceuticalsgroup.com/images/mainImage.webp')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-[2] text-center mb-6">
          <h1 className="font-bold text-white text-[clamp(2.5rem,5vw,4rem)] mb-2 tracking-[0.02em]" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>Enzyme Applications</h1>
          <p className="text-white/90 font-normal text-lg md:text-xl" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>Units, Information &amp; Industrial Applications Database</p>
        </div>
        <div className="relative z-[2] w-[90%] max-w-[700px]">
          <div className="relative flex items-center bg-white/95 backdrop-blur-[15px] rounded-[50px]" style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)" }}>
            <input placeholder="Search enzymes, applications, units, or specifications..."
              className="w-full h-[60px] text-lg px-6 pr-16 rounded-[50px] bg-transparent text-[#2c3e50] font-medium placeholder:text-[#7f8c8d] focus:outline-none" />
            <div className="absolute right-3 flex items-center justify-center w-10 h-10 rounded-full bg-[#F9A922] transition-transform hover:scale-110" style={{ boxShadow: "0 4px 12px rgba(249,169,34,0.3)" }}>
              <Search className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-center mt-2 text-white/90 text-sm font-medium">Explore enzyme types, activity units, and industrial applications</p>
        </div>
      </div>

      <div className="px-4 py-6 max-w-[1200px] mx-auto">
        <h2 className="mb-3 font-bold text-[#333] text-2xl">Activity, Measurement and Potency</h2>
        <p className="mb-4 text-[#666] leading-relaxed">We listen to our customers and always want to help, so we have created an enzyme tool for you on our website so you can find the right kind of enzyme and potency for your project. Whether it&apos;s for a gut health supplement, to increase muscle mass, heart health or a combination we have the technical know how and tools to point you in the right direction.</p>

        <h3 className="mt-4 mb-3 font-bold text-[#333] text-xl">Key Questions Answered:</h3>
        <div className="mb-4 flex flex-col gap-2">
          <p className="text-[#666] leading-relaxed">• Which enzyme is suitable for gut, muscle and heart applications</p>
          <p className="text-[#666] leading-relaxed">• What is the optimum temperature</p>
          <p className="text-[#666] leading-relaxed">• Which unit is used</p>
          <p className="text-[#666] leading-relaxed">• Which potency is ideal for your project</p>
        </div>
        <p className="mb-6 text-[#666] leading-relaxed">Below is a summary, for a more detailed view of the different units used globally please see our Enzyme table. Please contact our friendly and knowledgeable technical sales colleagues to help guide you to the best solutions for your formulations.</p>

        <h3 className="mt-4 mb-3 font-bold text-[#333] text-xl">Enzyme Applications and Specifications</h3>
        <div className="overflow-x-auto mb-6 shadow-md rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead><tr><TH>Item Code</TH><TH>Name</TH><TH>Applications</TH><TH>Optimum Temperature °C</TH><TH>Optimum pH</TH><TH>Common Units</TH></tr></thead>
            <tbody>
              {[
                ["NIGEENZ000090","Amylase 2500 SKB/g (Fungal)","Hydrolyses carbohydrates (starch) into simple sugars, improving absorption and energy uptake. Applications in digestive health and weight management.","40 – 60","4.0 – 6.0","DU / SKB"],
                ["NIGEENZ000095","Amylase 5000 SKB/g (Fungal)","Hydrolyses carbohydrates (starch) into simple sugars, improving absorption and energy uptake. Applications in digestive health and weight management.","40 – 60","4.0 – 6.0","DU / SKB"],
                ["NIGEENZ000191","Bromelain 80 GDU/g 10:1 (Pineapple)","Derived from pineapple stem, a broad specificity protease which hydrolyses protein to amino acids. Applications in meat tenderising and reducing inflammation.","40 – 60","5.0 – 8.0","GDU / PU / MCU"],
                ["NIGEENZ000201","Bromelain 1200 GDU/g (Pineapple)","Derived from pineapple stem, a broad specificity protease which hydrolyses protein to amino acids. Applications in meat tenderising and reducing inflammation.","40 – 60","5.0 – 8.0","GDU / PU / MCU"],
                ["NIGEENZ000208","Catalase 600 Baker/g","Hydrolyses harmful hydrogen peroxide into oxygen and water. Applications in inflammation, anti-ageing, weight management and fat reduction.","20 – 50","5.0 – 8.0","Baker"],
                ["NIGEENZ000210","Cellulase (Trichoderma) 400 U/g","Hydrolyses cellulose carbohydrate into glucose. Applications in weight management and digestive health.","40 – 60","4.0 – 6.0","U / CU"],
                ["NIGEENZ000214","Chitinase 1000 U/g","Hydrolyses Chitin found in yeast, fungi and algae. Applications in gut health and immune system regulation.","45 – 55","4.0 – 6.0","U / CU"],
                ["NIGEENZ000215","Hemicellulase 50000 CU/g","Hydrolyses hemicellulose – a cellulose component in cell walls of plants, facilitating the digestion of fruits and vegetables. Applications in digestive and gut health.","40 – 70","4.0 – 6.0","HCU / XU"],
                ["NIGEENZ000221","Chymotrypsin 75USP/mg","Hydrolyses protein into amino acids in the small intestine. Applications in inflammation and immune system health.","35 – 55","7.5 – 9.5","USP"],
                ["NIGEENZ000251","Collagenase 250000U/g","Endopeptidase that hydrolyses collagen. Applications in the breakdown of collagen in damaged tissue, connective tissue repair and joint and bone health.","30 – 40","6.0 – 8.5",""],
                ["NIGEENZ000261","Endopeptidase 10,000 HUT/g","Breaks down protein into amino acids from the middle of the protein chain. Applications in digestive health.","20 – 40","7.0 – 8.0","HUT"],
                ["NIGEENZ000265","Exopeptidase 15,000 U/g","Breaks down protein into amino acids from the end of the protein chain. Applications in digestive health.","20 – 40","7.0 – 8.0",""],
                ["NIGEENZ000271","Ficin (Vegetable Protease) 250 BAPA/g","Ficin is an enzyme from the Ficus insipida tree trunk. Hydrolyses protein into amino acids. Applications in digestive health and immune health.","60 – 80","5.0 – 5.5","HUT / PC"],
                ["NIGEENZ000301","Glucoamylase 100000 U/g","Hydrolyses partially digested starch/dextrin to glucose. Applications in digestive health and energy.","50 – 60","3.0 – 4.0","AGU"],
                ["NIGEENZ000305","Invertase 1000 SU/g","Catalyses the breakdown of sucrose into glucose and fructose. Applications in digestive health and energy.","20 – 65","3.0 – 5.0","SU"],
                ["NIGEENZ000311","Maltase 500 DP/g","Hydrolyses maltose into glucose simple sugar. Applications in digestive health and energy.","20 – 50","4.0 – 8.0","DP"],
                ["NIGEENZ000385","Lactase 300 ALU/g","Hydrolyses lactose into glucose and galactose. Applications in digestive health and products suitable for lactose intolerant individuals.","35 – 60","4.0 – 6.0","ALU"],
                ["NIGEENZ000401","Lactase 3000 ALU/g","Hydrolyses lactose into glucose and galactose. Applications in digestive health and products suitable for lactose intolerant individuals.","35 – 60","4.0 – 6.0","ALU"],
                ["NIGEENZ000585","Lipase 60 U/g (Fungal)","Hydrolyses lipids (fats) to fatty acids and glycerol. Applications in digestive health and weight management","30 – 50","4.0 – 7.0",""],
                ["NIGEENZ000590","Lipase 1000 U/g (Fungal)","Hydrolyses lipids (fats) to fatty acids and glycerol. Applications in digestive health and weight management","30 – 50","4.0 – 7.0","LU / FIP"],
                ["NIGEENZ000610","Nattokinase 2000 FU/g","A serine protease that hydrolyses protein to amino acids. Produced from \"Natto\" a fermented soy product in Japan. Applications in heart and circulatory health.","30 – 50","6.0 – 9.0","FU"],
                ["NIGEENZ000620","Nattokinase 10000 FU/g","A serine protease that hydrolyses protein to amino acids. Produced from \"Natto\" a fermented soy product in Japan. Applications in heart and circulatory health.","30 – 50","6.0 – 9.0","FU"],
                ["NIGEENZ000801","Pancreatin 4XNF (Fungal)","Naturally contains lipase, protease and amylase enzymes to digest lipids, proteins and starch. Applications in digestive health and improving the absorption of fat soluble vitamins.","30 – 55","7.0 – 9.0","XNF"],
                ["NIGEENZ000901","Papain 2000 USP-U/mg (Papaya)","Broad specificity protease that hydrolyses protein into amino acids. Applications in digestive health and sports nutrition.","65 – 80","5.0 – 7.0","PU"],
                ["NIGEENZ000911","Papain 6000 USP-U/mg (Papaya)","Broad specificity protease that hydrolyses protein into amino acids. Applications in digestive health and sports nutrition.","65 – 80","5.0 – 7.0","PU"],
                ["NIGEENZ000921","Pectinase 300 Endo-PG/g","Pectinase hydrolyses pectin. Used to improve the digestion of plant based foods. Applications in digestive health.","40 – 55","4.0 – 6.0","Endo-PG"],
                ["NIGEENZ001101","Pepsin 300NF (1:300)","Hydrolyses protein into its amino acid constituents. Applications in digestive health and sports nutrition, increasing muscle mass.","40 – 65","2.0 – 4.0","Pepsin Units"],
                ["NIGEENZ001201","Phytase 3000 U/g","Hydrolyses phytate to release phosphate, reducing the anti-nutritional effect of phytate. Allows the body to better absorb amino acids, phosphorous, calcium and energy from food.","45 – 60","4.0 – 6.0","FTU"],
                ["NIGEENZ001291","Protease 3 – 300000 HUT/g","A non-specific protein hydrolysing enzyme that breaks protein into amino acids. Applications in digestive health, energy and inflammation.","30 – 60","3","SAPU / HUT"],
                ["NIGEENZ001490","Protease 200000 HUT/g (Fungal)","A non-specific protein hydrolysing enzyme that breaks protein into amino acids. Applications in digestive health, energy and inflammation.","30 – 60","6.0 – 8.0","SAPU / HUT"],
                ["NIGEENZ001601","Serrapeptase (Serratiopeptidase) 1600 U/mg","A proteolytic enzyme that hydrolyses proteins into amino acids. Applications in circulatory and respiratory health, inflammation, scarring, improving cold symptoms.","50 – 60","8.0 – 10","SPU"],
                ["NIGEENZ001651","Superoxide Dismutase (SOD) Bovine 8000 U/g","Breaks down potentially harmful oxygen molecules in cells. Applications in injury recovery and immune health.","30 – 45","7.0 – 9.0",""],
                ["NIGEENZ001701","Sucrase 1000 SU/g","Catalyses the breakdown of sucrose into glucose and fructose. Applications in digestive health and energy.","20 – 65","3.0 – 5.0",""],
                ["NIGEENZ001751","Trypsin 250USP/mg","Proteolytic enzyme that hydrolyses protein into amino acids. Applications in digestive health, muscle repair and injury recovery.","35 – 60","7.0 – 9.0","USP"],
                ["NIGEENZ003001","Ox Bile Powder CP2010","Applications in digestive health and weight management","20 – 65","6.0 – 7.0",""],
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
