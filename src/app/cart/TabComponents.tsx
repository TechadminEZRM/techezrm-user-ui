import type React from "react";
import { Settings, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { sampleProducts, type Truck } from "./types";

interface ProductsTabProps {
  onNext: () => void;
}

interface ContainerTrucksTabProps {
  selectedTruckForDetail: Truck | null;
  showTruckDetail: boolean;
  containerCount: number;
  setContainerCount: (count: number) => void;
  containerType: string;
  setContainerType: (type: string) => void;
  loadingRules: string;
  setLoadingRules: (rules: string) => void;
  loadSpecificGroups: boolean;
  setLoadSpecificGroups: (value: boolean) => void;
  onAddContainer: () => void;
  onAddTruck: () => void;
  onNext: () => void;
  onBack: () => void;
}

interface StuffingResultTabProps {
  onBack: () => void;
}

const pillInput = "border border-[rgba(217,217,217,1)] rounded-[20px] bg-[#fafafa] text-xs text-center focus:outline-none";

export const ProductsTab: React.FC<ProductsTabProps> = ({ onNext }) => (
  <>
    {/* Action Buttons */}
    <div className="flex justify-between items-center gap-2 p-4 bg-[rgba(251,251,251,1)] border-b border-[#f0f0f0] mt-4 mb-4">
      <button className="text-xs font-medium text-white bg-gradient-to-r from-[#F9A922] to-[#E8981F] min-w-[135px] h-[38px] rounded-[5px] hover:opacity-90 transition-opacity">
        + Add Group
      </button>
      <div className="flex gap-4">
        <button className="text-xs font-medium border border-[#e0e0e0] text-[#52c41a] bg-[rgba(238,249,236,1)] min-w-[135px] h-[38px] rounded-[5px] hover:border-[#52c41a] transition-colors">Import</button>
        <button className="text-xs font-medium border border-[#e0e0e0] text-[#1890ff] bg-[rgba(230,232,255,1)] min-w-[135px] h-[38px] rounded-[5px] hover:border-[#1890ff] transition-colors">Export</button>
        <button className="text-xs font-medium border border-[#e0e0e0] text-white bg-gradient-to-r from-[rgba(255,199,0,1)] to-[rgba(255,143,107,1)] min-w-[135px] h-[38px] rounded-[5px] hover:opacity-90 transition-opacity">Upgrade</button>
      </div>
    </div>

    {/* Table Section */}
    <div className="p-4 bg-white">
      {/* Group Header */}
      <div className="flex items-center gap-4 mb-4 p-2 border-b border-[rgba(203,204,214,1)]">
        <div className="w-3 h-3 bg-[#333] rounded-full" />
        <span className="text-sm font-semibold text-[#333]">Group #1</span>
        <div className="flex items-center gap-1 ml-auto">
          <button className="w-7 h-7 flex items-center justify-center hover:bg-[#f5f5f5] rounded">
            <img src="/bin.png" alt="Delete" className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center text-[#1890ff] hover:bg-[#f5f5f5] rounded">
            <ArrowUp className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center text-[#52c41a] hover:bg-[#f5f5f5] rounded">
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              {["Type", "Product Name", "Length/Diameter", "Width", "Height", "Weight", "Quantity", "Color", "Stock"].map((h, i) => (
                <th key={h} className={`text-xs font-semibold text-[#666] py-2 ${i > 1 ? "text-center" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sampleProducts.map((product, index) => (
              <tr key={index}>
                <td className="py-3">
                  <div className="w-6 h-6 bg-[#f0f0f0] rounded flex items-center justify-center text-xs">{product.type}</div>
                </td>
                <td className="py-3">
                  <span className={`${pillInput} px-4 py-1.5 inline-block w-[100px]`}>{product.name}</span>
                </td>
                {[
                  { val: product.length, unit: "mm" },
                  { val: product.width, unit: "mm" },
                  { val: product.height, unit: "mm" },
                  { val: product.weight, unit: "kg" },
                ].map(({ val, unit }, i) => (
                  <td key={i} className="py-3 text-center">
                    <span className={`${pillInput} px-3 py-1.5 inline-block w-[100px]`}>
                      {val} <span className="text-[#999]">{unit}</span>
                    </span>
                  </td>
                ))}
                <td className="py-3 text-center">
                  <span className={`${pillInput} px-4 py-1.5 inline-block w-[100px] font-semibold`}>{product.quantity}</span>
                </td>
                <td className="py-3 text-center">
                  <div className="w-4 h-4 rounded-full mx-auto" style={{ backgroundColor: product.color }} />
                </td>
                <td className="py-3 text-center">
                  <div className="flex gap-1 justify-center">
                    <button className="w-7 h-7 flex items-center justify-center text-[#1890ff] hover:bg-[#f5f5f5] rounded">
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center hover:bg-[#f5f5f5] rounded">
                      <img src="/bin.png" alt="Delete" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button className="text-xs text-[#1890ff] font-medium hover:underline p-0">+ Add Product</button>
          <span className="text-xs text-[#999]">Use Palette ?</span>
        </div>
        <button className="text-xs text-[#1890ff] cursor-pointer hover:underline">1,245 Product(s)</button>
      </div>
    </div>

    {/* Next Button */}
    <div className="flex justify-center p-6 bg-white border-t border-[#f0f0f0]">
      <button onClick={onNext} className="bg-[#F9A922] hover:bg-[#E8981F] text-white text-sm font-semibold px-8 py-2 rounded transition-colors min-w-[120px]">Next</button>
    </div>
  </>
);

export const ContainerTrucksTab: React.FC<ContainerTrucksTabProps> = ({
  selectedTruckForDetail, showTruckDetail, containerCount, setContainerCount, containerType, setContainerType,
  loadingRules, setLoadingRules, loadSpecificGroups, setLoadSpecificGroups,
  onAddContainer, onAddTruck, onNext, onBack,
}) => (
  <div className="bg-white px-2 sm:px-3 md:px-6 pt-4 sm:pt-6 md:pt-8">
    {/* Top Bar */}
    <div className="flex justify-between items-start mb-6">
      <div className="flex gap-4">
        <button onClick={onAddContainer} className="bg-[#FF8043] hover:bg-[#FF8043] text-white text-[15px] font-medium px-6 py-2 rounded-[10px] min-w-[160px]">+ Add Container</button>
        <button onClick={onAddTruck} className="bg-[#FF8043] hover:bg-[#FF8043] text-white text-[15px] font-medium px-6 py-2 rounded-[10px] min-w-[140px]">+ Add Truck</button>
      </div>
      <div className="flex items-center bg-[#fff7f1] px-5 py-2 rounded-[12px] min-h-[40px] gap-2">
        <input type="checkbox" defaultChecked className="accent-[#FF8043] w-5 h-5" />
        <span className="text-[15px] font-medium text-[#FF8043] whitespace-nowrap">Automatic container selection</span>
      </div>
    </div>

    {/* Main Content */}
    {selectedTruckForDetail && showTruckDetail ? (
      <div className="py-4 rounded-[8px] bg-white max-w-[900px] mx-auto">
        {/* Dropdown + Icons row */}
        <div className="flex items-center justify-between mb-4">
          <select
            value={containerType}
            onChange={(e) => setContainerType(e.target.value)}
            className="border border-[rgba(217,217,217,1)] rounded-[20px] bg-[#fafafa] text-xs px-3 py-1.5 w-[150px] focus:outline-none"
          >
            <option value="20' STANDARD">20' STANDARD</option>
            <option value="40' STANDARD">40' STANDARD</option>
            <option value="40' HIGH CUBE">40' HIGH CUBE</option>
          </select>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center text-[#ff4d4f] hover:bg-[#fff1f0] rounded"><Trash2 className="w-4 h-4" /></button>
            <button className="w-8 h-8 flex items-center justify-center text-[#1890ff] hover:bg-[#f0f7ff] rounded"><ArrowUp className="w-4 h-4" /></button>
            <button className="w-8 h-8 flex items-center justify-center text-[#52c41a] hover:bg-[#f6ffed] rounded"><ArrowDown className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Main row */}
        <div className="flex gap-8 items-start mb-4">
          <div className="w-[200px] h-[180px] bg-[#ebebe9] rounded-[8px] flex items-center justify-center flex-shrink-0 text-[80px]">📦</div>
          <div className="flex-1">
            {/* Labels row */}
            <div className="flex items-center gap-4 mb-2">
              {["Count", "Length", "Width", "Height", "Max Weight"].map((l) => (
                <span key={l} className="text-[13px] text-center" style={{ width: l === "Count" ? "80px" : "100px" }}>{l}</span>
              ))}
            </div>
            {/* Input fields row */}
            <div className="flex items-center gap-4 mb-6">
              {/* Count */}
              <div className={`${pillInput} flex items-center h-8 px-1`} style={{ width: "80px" }}>
                <button className="w-5 h-5 text-xs text-[#666] hover:bg-[#f0f0f0] rounded-full flex items-center justify-center" onClick={() => setContainerCount(Math.max(1, containerCount - 1))}>-</button>
                <input type="number" value={containerCount} onChange={(e) => setContainerCount(Math.max(1, parseInt(e.target.value) || 1))} className="w-full text-center text-xs bg-transparent focus:outline-none" min={1} />
                <button className="w-5 h-5 text-xs text-[#666] hover:bg-[#f0f0f0] rounded-full flex items-center justify-center" onClick={() => setContainerCount(containerCount + 1)}>+</button>
              </div>
              {/* Readonly fields */}
              {[{v: "678", u: "mm"}, {v: "678", u: "mm"}, {v: "678", u: "mm"}, {v: "678", u: "kg"}].map(({v, u}, i) => (
                <div key={i} className={`${pillInput} flex items-center h-8 px-3`} style={{ width: "100px" }}>
                  <span className="flex-1 text-center">{v}</span>
                  <span className="text-[10px] text-[#999]">{u}</span>
                </div>
              ))}
            </div>
            {/* Loading rules */}
            <p className="text-[13px] mb-2">Loading rules</p>
            <div className="flex items-center gap-4">
              <select
                value={loadingRules}
                onChange={(e) => setLoadingRules(e.target.value)}
                className="border border-[rgba(217,217,217,1)] rounded-[20px] bg-[#fafafa] text-xs px-3 py-1.5 w-[120px] focus:outline-none"
              >
                <option value="Auto">Auto</option>
                <option value="Manual">Manual</option>
              </select>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={loadSpecificGroups} onChange={(e) => setLoadSpecificGroups(e.target.checked)} className="w-4 h-4 accent-[#F9A922]" />
                <span className="text-[13px] text-[#000]">Load only specific groups</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-8">
          <button onClick={onBack} className="min-w-[96px] border border-[#f6e1da] text-[#ff8144] font-semibold text-sm px-6 py-2 rounded-[8px] hover:bg-[rgba(255,129,68,0.04)] transition-colors">Back</button>
          <button onClick={onNext} className="min-w-[112px] bg-[#ff8144] hover:bg-[#E8981F] text-white font-semibold text-sm px-6 py-2 rounded-[8px] transition-colors">Next</button>
        </div>
      </div>
    ) : (
      <div className="bg-white rounded-[16px] min-h-[250px] sm:min-h-[330px] md:min-h-[340px] flex items-center justify-center mb-6 md:mb-10 border-2 border-[rgba(248,248,248,1)] px-4 py-8">
        <div className="flex flex-col items-center">
          <div className="text-[54px] text-[#1890ff] mb-4">📦</div>
          <p className="font-semibold text-[18px] text-[#220c1b]">Please add Transport</p>
        </div>
      </div>
    )}

    {!showTruckDetail && (
      <div className="flex justify-center items-center gap-6 mb-4">
        <button onClick={onBack} className="min-w-[120px] bg-[#ffe7db] text-[#ff8144] font-semibold text-base px-6 h-11 rounded-[8px] hover:bg-[#ffe7db] transition-colors">Back</button>
        <button onClick={onNext} className="min-w-[120px] bg-[#ff8144] text-white font-semibold text-base px-6 h-11 rounded-[8px] hover:bg-[#E8981F] transition-colors">Next</button>
      </div>
    )}
  </div>
);

export const StuffingResultTab: React.FC<StuffingResultTabProps> = ({ onBack }) => {
  const tableData = [
    { name: "Big Bags", packages: 16, volume: "10.00 m³", weight: "105.00 kg", color: "#007bff", icon: "📦" },
    { name: "Socks", packages: 100, volume: "4.060 m³", weight: "105.00 kg", color: "#e83e8c", icon: "🧦" },
    { name: "Boxes 1", packages: 80, volume: "4.060 m³", weight: "109.00 kg", color: "#28a745", icon: "📦" },
  ];

  return (
    <div className="bg-white p-4">
      <div className="flex gap-6 mb-6">
        {/* Left — Container Details */}
        <div className="w-[200px] flex-shrink-0">
          {/* Container 1 */}
          <div className="border border-[#e9ecef] rounded-t text-center px-4 py-2 bg-[#f8f9fa]">
            <span className="text-xs font-semibold text-[#495057]">20 STANDARD</span>
          </div>
          <div className="border border-[#e9ecef] border-t-0 rounded-b bg-white p-4 text-center min-h-[180px]">
            <div className="w-full h-[120px] bg-[#f8f9fa] rounded flex items-center justify-center mb-4 relative">
              <div className="w-[80px] h-[60px] bg-[#e9ecef] rounded relative after:content-[''] after:absolute after:-top-2 after:left-2 after:w-[80px] after:h-[60px] after:bg-[#dee2e6] after:rounded after:-z-10" />
            </div>
            <div className="text-left text-xs text-[#6c757d] space-y-1">
              <div><span className="text-[#dc3545] font-semibold">1</span> Unit</div>
              <div><span>Weight: </span><span className="font-semibold">14300.00 kg</span></div>
              <div><span>Volume: </span><span className="font-semibold">28.36 m³</span></div>
            </div>
          </div>

          {/* Container 2 */}
          <div className="mt-6">
            <div className="border border-[#e9ecef] rounded-t text-center px-4 py-2 bg-[#f8f9fa]">
              <span className="text-xs font-semibold text-[#495057]">20 STANDARD #1</span>
            </div>
            <div className="border border-[#e9ecef] border-t-0 rounded-b bg-white p-4 text-center min-h-[180px] relative">
              <div className="w-full h-[120px] bg-[#f8f9fa] rounded flex items-center justify-center mb-4 overflow-hidden">
                <div className="relative w-[100px] h-[80px]">
                  <div className="absolute bottom-0 left-2.5 w-[80px] h-5 bg-[#28a745] rounded" />
                  <div className="absolute bottom-5 left-5 w-[60px] h-7 bg-[#e83e8c] rounded" />
                  <div className="absolute bottom-[50px] left-7 w-10 h-[15px] bg-[#28a745] rounded" />
                </div>
              </div>
              <div className="text-left text-xs text-[#6c757d]">
                <div><span className="text-[#dc3545] font-semibold">1</span> Unit</div>
              </div>
              <span className="absolute bottom-2 right-2 bg-[#dc3545] text-white text-[9px] font-semibold px-2 py-1 rounded-full">🔥 29 View</span>
            </div>
          </div>
        </div>

        {/* Right — Stats and Table */}
        <div className="flex-1">
          {/* Stats */}
          <div className="mb-6">
            <p className="text-sm text-[#6c757d] mb-1">Total</p>
            <p className="text-lg font-semibold text-[#495057] mb-4">190 Packages</p>
            <div className="flex gap-8">
              <div>
                <p className="text-xs text-[#6c757d] mb-1">Cargo Volume</p>
                <p className="text-sm font-semibold text-[#495057]">28.30 m³ <span className="text-xs text-[#28a745] ml-1">(85% of volume)</span></p>
              </div>
              <div>
                <p className="text-xs text-[#6c757d] mb-1">Cargo Weight</p>
                <p className="text-sm font-semibold text-[#495057]">14300.00 kg <span className="text-xs text-[#28a745] ml-1">(90% of max weight)</span></p>
              </div>
            </div>
          </div>

          {/* Chart + Table */}
          <div className="flex gap-6">
            {/* Pie Chart */}
            <div className="w-[120px] h-[120px] flex-shrink-0">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="45" fill="none" stroke="#e9ecef" strokeWidth="18" />
                <circle cx="60" cy="60" r="45" fill="none" stroke="#007bff" strokeWidth="18" strokeDasharray="45 237" strokeDashoffset="0" transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="45" fill="none" stroke="#e83e8c" strokeWidth="18" strokeDasharray="126 156" strokeDashoffset="-45" transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="45" fill="none" stroke="#28a745" strokeWidth="18" strokeDasharray="111 171" strokeDashoffset="-171" transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="27" fill="white" />
              </svg>
            </div>

            {/* Data Table */}
            <div className="flex-1">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 mb-2 pb-2 border-b border-[#e9ecef]">
                {["Name", "Packages", "Volume", "Weight", ""].map((h, i) => (
                  <span key={i} className={`text-xs font-semibold text-[#6c757d] ${i > 0 ? "text-center" : ""}`}>{h}</span>
                ))}
              </div>
              {tableData.map((item, index) => (
                <div key={index} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 py-2 items-center hover:bg-[#f8f9fa]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium text-[#495057]">{item.name}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs">{item.icon}</span>
                    <span className="text-xs font-medium text-[#495057]">{item.packages}</span>
                  </div>
                  <span className="text-xs text-[#495057] text-center">{item.volume}</span>
                  <span className="text-xs text-[#495057] text-center">{item.weight}</span>
                  <span className="text-xs text-[#6c757d] text-center">📊</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-[#e9ecef]">
        <button onClick={onBack} className="min-w-[100px] border border-[#ff8144] text-[#ff8144] bg-white hover:bg-[#fff5f2] text-sm font-medium px-6 h-9 rounded-[8px] transition-colors">Back</button>
        <button className="min-w-[100px] bg-[#ff8144] hover:bg-[#E8981F] text-white text-sm font-medium px-6 h-9 rounded-[8px] shadow-none transition-colors">Create as PDF</button>
        <button className="min-w-[100px] bg-[#ff8144] hover:bg-[#E8981F] text-white text-sm font-medium px-6 h-9 rounded-[8px] shadow-none transition-colors">Copy Result</button>
      </div>
    </div>
  );
};
