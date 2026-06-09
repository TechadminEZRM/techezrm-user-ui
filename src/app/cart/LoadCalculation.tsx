import type React from "react";
import { useState } from "react";
import { Settings, ArrowUp, ArrowDown, Trash2, X } from "lucide-react";
import { ProductsTab, ContainerTrucksTab, StuffingResultTab } from "./TabComponents";
import { trucks, type Truck } from "./types";

const LoadCalculation: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isTruckModalOpen, setIsTruckModalOpen] = useState(false);
  const [isContainerModalOpen, setIsContainerModalOpen] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [selectedTruckForDetail, setSelectedTruckForDetail] = useState<Truck | null>(null);
  const [showTruckDetail, setShowTruckDetail] = useState(false);
  const [containerCount, setContainerCount] = useState(1);
  const [containerType, setContainerType] = useState("20' STANDARD");
  const [loadingRules, setLoadingRules] = useState("Auto");
  const [loadSpecificGroups, setLoadSpecificGroups] = useState(false);

  const handleOpenTruckModal = () => {
    setSelectedTruck(null);
    setShowTruckDetail(false);
    setIsTruckModalOpen(true);
  };
  const handleCloseTruckModal = () => {
    setIsTruckModalOpen(false);
    setSelectedTruck(null);
    setShowTruckDetail(false);
  };
  const handleSelectTruck = (truck: Truck) => setSelectedTruck(truck);
  const handleTruckSelect = () => {
    if (selectedTruck) {
      setSelectedTruckForDetail(selectedTruck);
      setShowTruckDetail(true);
      setIsTruckModalOpen(false);
    }
  };
  const handleOpenContainerModal = () => setIsContainerModalOpen(true);
  const handleCloseContainerModal = () => setIsContainerModalOpen(false);
  const handleNextTab = () => setActiveTab((p) => Math.min(p + 1, 2));
  const handlePrevTab = () => setActiveTab((p) => Math.max(p - 1, 0));

  const tabs = ["PRODUCTS", "CONTAINER & TRUCKS", "STUFFING RESULT"];

  return (
    <div className="mt-8 w-full">
      <p className="text-lg font-semibold text-body mb-5">Load & Stuffing Calculation</p>

      <div className="border border-transparent rounded-[8px] overflow-hidden">
        {/* Tab Header */}
        <div className="flex items-center bg-[rgba(251,251,251,1)] min-h-[56px]">
          {tabs.map((tab, index) => (
            <div
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`flex-1 flex items-center justify-center h-14 cursor-pointer text-[13px] font-semibold transition-all relative hover:text-brand ${index < 2 ? "border-r-[3px] border-wash" : ""} ${activeTab === index ? "text-brand border-b-2 border-b-brand" : "text-[rgba(90,96,127,0.77)] border-b-2 border-b-transparent"}`}
            >
              {tab}
            </div>
          ))}
          <button className="m-2 border border-transparent rounded w-9 h-9 flex items-center justify-center bg-white hover:bg-paper">
            <Settings className="w-[18px] h-[18px] text-faint" />
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 0 && <ProductsTab onNext={handleNextTab} />}
        {activeTab === 1 && (
          <ContainerTrucksTab
            selectedTruckForDetail={selectedTruckForDetail}
            showTruckDetail={showTruckDetail}
            containerCount={containerCount}
            setContainerCount={setContainerCount}
            containerType={containerType}
            setContainerType={setContainerType}
            loadingRules={loadingRules}
            setLoadingRules={setLoadingRules}
            loadSpecificGroups={loadSpecificGroups}
            setLoadSpecificGroups={setLoadSpecificGroups}
            onAddContainer={handleOpenContainerModal}
            onAddTruck={handleOpenTruckModal}
            onNext={handleNextTab}
            onBack={handlePrevTab}
          />
        )}
        {activeTab === 2 && <StuffingResultTab onBack={handlePrevTab} />}
      </div>

      {/* Truck Selection Modal */}
      {isTruckModalOpen && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/50">
          <div className="w-[95%] sm:w-[85%] md:w-[75%] lg:w-[1000px] max-h-[90vh] bg-white rounded-[8px] shadow-[0_8px_30px_rgba(0,0,0,0.2)] overflow-hidden relative flex flex-col">
            {/* Modal Header */}
            <div className="bg-paper px-6 py-4 border-b border-line-light flex items-center justify-between">
              <div className="flex gap-8">
                <span className="flex items-center gap-2 text-[#667080] text-base font-medium cursor-pointer">🏛️ Container</span>
                <span className="flex items-center gap-2 text-info text-base font-semibold cursor-pointer border-b-[3px] border-info pb-2">🚚 Truck</span>
              </div>
              <button onClick={handleCloseTruckModal} className="w-8 h-8 flex items-center justify-center hover:bg-wash rounded transition-colors">
                <X className="w-4 h-4 text-dim" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {trucks.map((truck) => (
                  <div
                    key={truck.id}
                    onClick={() => handleSelectTruck(truck)}
                    className={`cursor-pointer rounded-[8px] p-4 text-center flex flex-col items-center gap-3 min-h-[200px] bg-white transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] ${selectedTruck?.id === truck.id ? "border-[3px] border-info" : "border border-line-light hover:border-info"}`}
                  >
                    <p className="text-sm font-semibold text-[#18202c] whitespace-pre-line leading-tight min-h-[40px] flex items-center">{truck.name}</p>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-[120px] h-[80px] bg-surface rounded flex items-center justify-center text-[40px]">🚛</div>
                    </div>
                    <p className="text-xs font-semibold text-[#9aa5b1] uppercase tracking-wide">LEARN MORE</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-paper border-t border-line-light flex justify-end gap-3">
              <button onClick={handleCloseTruckModal} className="font-semibold text-sm px-8 py-2 rounded-[8px] border border-line-light text-[#5992ff] hover:border-[#5992ff] hover:bg-[rgba(89,146,255,0.04)] transition-colors">Cancel</button>
              <button
                onClick={handleTruckSelect}
                disabled={!selectedTruck}
                className="font-semibold text-sm px-8 py-2 rounded-[8px] bg-info hover:bg-[#0c7cd5] disabled:bg-[#d1d5db] disabled:text-[#9ca3af] text-white transition-colors"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Container Modal */}
      {isContainerModalOpen && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-[8px] shadow-[0_8px_30px_rgba(0,0,0,0.2)] p-8 min-w-[300px] text-center">
            <h3 className="text-xl font-semibold mb-6">Coming Soon</h3>
            <p className="text-dim mb-6">Container functionality will be available soon!</p>
            <button onClick={handleCloseContainerModal} className="bg-brand hover:bg-brand-hover text-white px-8 py-2 rounded text-sm font-semibold transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadCalculation;
