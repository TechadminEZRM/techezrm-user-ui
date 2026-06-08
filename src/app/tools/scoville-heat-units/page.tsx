import React from "react";
import { Search } from "lucide-react";
import CompanyContactInfo from "@/components/CompanyContactInfo";

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="font-bold text-left p-3 text-sm border-b border-[#e8e8e8] bg-[#f5f5f5]">{children}</th>
);
const TD = ({ children }: { children: React.ReactNode }) => (
  <td className="p-3 text-sm text-[#333]">{children}</td>
);

export default function ScovilleHeatUnitsPage() {
  return (
    <div className="min-h-screen">
      <div className="w-full py-64 flex flex-col justify-center items-center relative"
        style={{ backgroundImage: "url('https://nutraceuticalsgroup.com/images/mainImage.webp')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-[2] text-center mb-6">
          <h1 className="font-bold text-white text-[clamp(2.5rem,5vw,4rem)] mb-2 tracking-[0.02em]" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>Scoville Heat Units</h1>
          <p className="text-white/90 font-normal text-lg md:text-xl" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>Heat Scale &amp; Capsaicin Measurement Database</p>
        </div>
        <div className="relative z-[2] w-[90%] max-w-[700px]">
          <div className="relative flex items-center bg-white/95 backdrop-blur-[15px] rounded-[50px]" style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)" }}>
            <input placeholder="Search heat levels, peppers, capsaicin content, or SHU ratings..."
              className="w-full h-[60px] text-lg px-6 pr-16 rounded-[50px] bg-transparent text-[#2c3e50] font-medium placeholder:text-[#7f8c8d] focus:outline-none" />
            <div className="absolute right-3 flex items-center justify-center w-10 h-10 rounded-full bg-[#F9A922] transition-transform hover:scale-110" style={{ boxShadow: "0 4px 12px rgba(249,169,34,0.3)" }}>
              <Search className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-center mt-2 text-white/90 text-sm font-medium">Explore the complete Scoville scale from mild to extreme heat levels</p>
        </div>
      </div>

      <div className="px-4 py-6 max-w-[1200px] mx-auto">
        <h2 className="mb-3 font-bold text-[#333] text-2xl">Understanding the Scoville Scale</h2>
        <p className="mb-4 text-[#666] leading-relaxed">The Scoville scale is the measurement system used to quantify the heat or spiciness of chilli peppers and other spicy foods. Developed by American pharmacist Wilbur Scoville in 1912, this scale is determined by a panel of people tasting diluted samples with the human tongue, rather than using a chemical method and provides a numerical value that represents the concentration of capsaicin, the compound responsible for the burning sensation experienced when consuming spicy foods.</p>
        <p className="mb-4 text-[#666] leading-relaxed">The Scoville scale ranges from 0 to over 16 million Scoville Heat Units (SHU), with the lower end representing mild, sweet peppers and the higher end representing the most intensely fiery chilli peppers. The scale works by measuring the amount of capsaicin present in a specific pepper variety, with a higher SHU indicating a greater concentration of this compound.</p>
        <p className="mb-6 text-[#666] leading-relaxed">Understanding the Scoville scale is crucial when exploring the world of chilli peppers, as it allows us to appreciate the nuances of spiciness and make informed choices about the level of heat we can handle. This knowledge can enhance our culinary and health experiences, whether we&apos;re experimenting with supplements, creating spicy condiments, or simply enjoying the thrill of a well-balanced, flavorful dish.</p>
        <p className="mb-4 text-[#666] leading-relaxed">Nutraceuticals Group Europe supplies a range of the chilli powders and extracts, but are we too hot for you to handle? Below we have the Scoville scale so you can see which ingredient suits you, your product and your customers.</p>

        <h3 className="mt-4 mb-3 font-bold text-[#333] text-xl">Complete Scoville Heat Scale</h3>
        <div className="overflow-x-auto mb-6 shadow-md rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead><tr><TH>Approx Heat Rating (SHU)</TH><TH>Heat vs Pure Capsaicin</TH><TH>Example</TH><TH>Approx Pungency</TH><TH>Source</TH><TH>Code</TH><TH>Item Name</TH></tr></thead>
            <tbody>
              {[
                ["16,000,000,000","100000%","Resiniferatoxin","","Chemical","",""],
                ["5,300,000,000","33125%","Tinyatoxin","","Chemical","",""],
                ["16,000,000","100%","Capsaicin Pure","Pure Capsaicin","Chemical","",""],
                ["15,000,000","94%","Dihydrocapsaicin","","Chemical","",""],
                ["9,200,000","58%","Nonivamide","","Chemical","",""],
                ["9,100,000","57%","Nordihydrocapsaicin","","Chemical","",""],
                ["8,600,000","54%","Homocapsaicin, Homodihydrocapsaicin","","Chemical","",""],
                ["2,200,000","14%","Carolina Reaper, Dragons Breath","","Pepper","",""],
                ["2,009,999","13%","Trinidad Moruga Scorpion","","Pepper","",""],
                ["2,000,000","13%","Pepper Spray","Extreme Heat","Chemical","",""],
                ["1,600,000","10%","Capsaicin 10%","","Pepper","NIGEHER008215","Capsicum Pepper Extract Oleoresin 10% Capsaicin 1.6 Million SHU ~60:1 (Chilli) (Capsicum annuum)"],
                ["1,350,000","8%","Naga Viper","","Pepper","",""],
                ["1,000,000","6%","Capsaicin 6.2%","","Pepper","NIGEHER008211","Capsicum Pepper Extract Oleoresin 6.2% Capsaicin 1 Million SHU ~40:1 (Chilli) (Capsicum annuum)"],
                ["1,000,000","6%","Ghost Pepper (Bhut Jolokia)","","Pepper","",""],
                ["800,000","5%","Capsaicin 5%","","Chemical","",""],
                ["750,000","5%","Infinity Chilli, Bhut Jolokia chili pepper, Super Naga","","Pepper","",""],
                ["500,000","3.1%","Red Savina habanero","","Pepper","",""],
                ["400,000","2.5%","Capsaicin 2.5%","","Chemical","",""],
                ["400,000","2.5%","Animal Repellant - Capsaicin 2.5%","","Chemical","",""],
                ["350,000","2.2%","Chocolate habanero, Habanaga, Nagabon","","Pepper","",""],
                ["200,000","1.3%","Habanero","Very High Heat","Pepper","",""],
                ["160,000","1.0%","Capsaicin 1%","","Chemical","",""],
                ["160,000","1.0%","Shogaol","","Chemical","",""],
                ["100,000","0.6%","Piperine","","Chemical","NIGEHER006001","Black Pepper Extract 95% Piperine ~25:1 (Piper nigrum)"],
                ["100,000","0.6%","Habanero chili, Scotch bonnet, Datil, Rocoto, White Habanero, Jamaican hot pepper","","Pepper","",""],
                ["80,000","0.5%","Capsaicin 0.5%","","Chemical","NIGEHER009001","Cayenne Pepper Extract 0.5% Capsaicinoids (Chilli) (Capsicum annuum Cayenne)"],
                ["75,000","0.5%","Red Amazon","","Pepper","",""],
                ["75,000","0.5%","Pequin","","Pepper","",""],
                ["70,000","0.4%","Chiltecepin","High Heat","Pepper","",""],
                ["60,000","0.4%","Gingerol","","Chemical","",""],
                ["50,000","0.3%","Byadgi chilli, Bird's eye chili (Thai Chili Pepper), Malagueta pepper, Chiltepin pepper, Piri piri","","Pepper","",""],
                ["30,000","0.2%","Cayenne Pepper","","Pepper","NIGEHER009301HT","Cayenne Pepper Powder (Chilli) (Capsicum annuum Cayenne) Heat Treated"],
                ["30,000","0.2%","Tabasco Pepper","","Pepper","",""],
                ["25,000","0.2%","Arbol","","Pepper","",""],
                ["25,000","0.2%","Japone","Moderate","Pepper","",""],
                ["25,000","0.2%","Guntur chilli, Ají pepper, Cumari pepper (Capsicum Chinense), Katara (spicy), Arbol pepper","","Pepper","",""],
                ["16,000","0.10%","Capsiate","","Pepper","",""],
                ["10,000","0.06%","Smoked Jalepeno (Chipotle)","","Pepper","",""],
                ["10,000","0.06%","Serrano pepper, Peter pepper, Aleppo pepper","","Pepper","",""],
                ["7,000","0.04%","Puya","","Pepper","",""],
                ["7,000","0.04%","Tabasco Sauce (Green Habanero)","","Pepper","",""],
                ["5,000","0.03%","Guajillo","","Pepper","",""],
                ["3,500","0.02%","Jalapeno pepper","","Pepper","",""],
                ["3,000","0.02%","Poblano","","Pepper","",""],
                ["2,500","0.02%","Tabasco Sauce (Red)","","Pepper","",""],
                ["2,500","0.02%","Pasilla","","Pepper","",""],
                ["2,500","0.02%","Espelette pepper, Chipotle, Guajillo pepper, Hungarian wax pepper, Bullet pepper","","Pepper","",""],
                ["2,200","0.01%","Sriracha Sauce","","Pepper","",""],
                ["2,000","0.01%","Tabasco Sauce (Chipotle)","","Pepper","",""],
                ["1,000","0.01%","Mild Jalepeno","Mild","Pepper","",""],
                ["1,000","0.01%","Guindillas peppers","","Pepper","",""],
                ["1,000","0.01%","New Mexican","","Pepper","",""],
                ["1,000","0.01%","Ancho","","Pepper","",""],
                ["1,000","0.01%","Anaheim pepper, Poblano pepper, Rocotillo pepper, Peppadew","","Pepper","",""],
                ["450","0.00%","Frank's Red Hot Sauce","","Pepper","",""],
                ["100","0.00%","Pimento, Peperoncini, Banana pepper","","Pepper","",""],
                ["0","0.00%","Bell pepper, Cubanelle, Aji dulce","No Heat","Pepper","NIGEHER008251","Red Bell Pepper Powder (Capsicum annuum) Heat Treated"],
              ].map((r, i) => <tr key={i} className="border-b border-[#e8e8e8] hover:bg-gray-50">{r.map((c, j) => <TD key={j}>{c}</TD>)}</tr>)}
            </tbody>
          </table>
        </div>

        <h3 className="mt-4 mb-3 font-bold text-[#333] text-xl">Available Products</h3>
        <div className="overflow-x-auto mb-6 shadow-md rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead><tr><TH>Item Code</TH><TH>Item Name</TH></tr></thead>
            <tbody>
              {[
                ["NIGEHER009001","Cayenne Pepper Extract 0.5% Capsaicinoids (Chilli) (Capsicum annuum Cayenne)"],
                ["NIGEHER009005","Cayenne Pepper Extract 0.6% Capsaicinoids (Chilli) (Capsicum annuum Cayenne)"],
                ["NIGEHER009010","Cayenne Pepper Extract 1.0% Capsaicinoids (Chilli) (Capsicum annuum Cayenne)"],
                ["NIGEHER009015","Cayenne Pepper Extract 1.3% Capsaicinoids (Chilli) (Capsicum annuum Cayenne)"],
                ["NIGEHER009080","Cayenne Pepper Extract 4:1 (Chilli) (Capsicum annuum Cayenne)"],
                ["NIGEHER009090","Cayenne Pepper Extract 7:1 (Chilli) (Capsicum annuum Cayenne)"],
                ["NIGEHER009101","Cayenne Pepper Extract 8:1 (Chilli) (Capsicum annuum Cayenne)"],
                ["NIGEHER009190","Cayenne Pepper Powder 40K SHU (Chilli) (Capsicum annuum Cayenne) NHT"],
                ["NIGEHER009201","Cayenne Pepper Powder 100K SHU (Chilli) (Capsicum annuum Cayenne) Heat Treated"],
                ["NIGEHER009301HT","Cayenne Pepper Powder (Chilli) (Capsicum annuum Cayenne) Heat Treated"],
              ].map((r, i) => <tr key={i} className="border-b border-[#e8e8e8] hover:bg-gray-50"><TD>{r[0]}</TD><TD>{r[1]}</TD></tr>)}
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
