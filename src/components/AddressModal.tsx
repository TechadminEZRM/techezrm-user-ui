"use client";

import React, { useEffect, useState } from "react";
import { Truck, X, Save, Map, Home, Building2, Store } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import MapSelector from "@/components/MapSelector";
import { customerAddressService, AddAddressRequest } from "@/api/services/customerAddress";

interface AddressFormData {
  companyName: string;
  receiverName: string;
  receiverEmail: string;
  receiverPhone: string;
  receiverPhoneCountryCode: string;
  type: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  coordinates: { latitude: string; longitude: string };
  isDefault: boolean;
  isActive: boolean;
}

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (addressData: AddressFormData) => void;
  initialData?: Partial<AddressFormData>;
  customerId?: string;
  editingAddressId?: string;
}

const defaultAddress: AddressFormData = {
  companyName: "", receiverName: "", receiverEmail: "", receiverPhone: "",
  receiverPhoneCountryCode: "+1", type: "home", street: "", city: "", state: "",
  country: "", zipCode: "", coordinates: { latitude: "", longitude: "" },
  isDefault: false, isActive: true,
};

const fieldClass =
  "flex h-10 w-full rounded-lg border border-[#e0e0e0] bg-white px-4 py-2 text-sm text-[#1F2A44] placeholder:text-[#737791] focus:outline-none focus:ring-2 focus:ring-[#F9A922] focus:border-[#F9A922]";

const countryCodes = [
  { code: "+54", country: "Argentina" }, { code: "+61", country: "Australia" },
  { code: "+43", country: "Austria" }, { code: "+32", country: "Belgium" },
  { code: "+55", country: "Brazil" }, { code: "+86", country: "China" },
  { code: "+420", country: "Czech Republic" }, { code: "+45", country: "Denmark" },
  { code: "+358", country: "Finland" }, { code: "+33", country: "France" },
  { code: "+49", country: "Germany" }, { code: "+30", country: "Greece" },
  { code: "+36", country: "Hungary" }, { code: "+91", country: "India" },
  { code: "+39", country: "Italy" }, { code: "+81", country: "Japan" },
  { code: "+52", country: "Mexico" }, { code: "+31", country: "Netherlands" },
  { code: "+64", country: "New Zealand" }, { code: "+47", country: "Norway" },
  { code: "+48", country: "Poland" }, { code: "+351", country: "Portugal" },
  { code: "+65", country: "Singapore" }, { code: "+82", country: "South Korea" },
  { code: "+34", country: "Spain" }, { code: "+46", country: "Sweden" },
  { code: "+41", country: "Switzerland" }, { code: "+44", country: "UK" },
  { code: "+1", country: "US/CA" },
];

const countries = [
  "Argentina", "Australia", "Austria", "Belgium", "Brazil", "Canada", "China",
  "Czech Republic", "Denmark", "Finland", "France", "Germany", "Greece", "Hungary",
  "India", "Italy", "Japan", "Mexico", "Netherlands", "New Zealand", "Norway",
  "Poland", "Portugal", "Singapore", "South Korea", "Spain", "Sweden", "Switzerland",
  "United Kingdom", "United States",
];

const addressTypes = [
  { value: "home", label: "Home", icon: Home },
  { value: "business", label: "Business", icon: Building2 },
  { value: "warehouse", label: "Warehouse", icon: Store },
];

const AddressModal: React.FC<AddressModalProps> = ({
  open, onClose, onSave, initialData, customerId, editingAddressId,
}) => {
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [addressData, setAddressData] = useState<AddressFormData>({ ...defaultAddress, ...initialData });

  useEffect(() => {
    setAddressData(initialData ? { ...defaultAddress, ...initialData } : { ...defaultAddress });
  }, [initialData]);

  const handleInputChange = (field: keyof AddressFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddressData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field: keyof AddressFormData) => (value: any) => {
    setAddressData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoordinatesChange = (field: "latitude" | "longitude") => (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressData((prev) => ({ ...prev, coordinates: { ...prev.coordinates, [field]: e.target.value } }));
  };

  const handleMapSelection = (lat: number, lng: number, address: string) => {
    setAddressData((prev) => ({ ...prev, coordinates: { latitude: lat.toString(), longitude: lng.toString() }, street: address }));
    setMapModalOpen(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (!addressData.companyName || !addressData.receiverName || !addressData.receiverEmail || !addressData.receiverPhone || !addressData.street || !addressData.city || !addressData.state || !addressData.country || !addressData.zipCode) {
        setError("Please fill in all required fields");
        setIsLoading(false);
        return;
      }
      const addressRequest: AddAddressRequest = {
        companyName: addressData.companyName, receiverName: addressData.receiverName,
        receiverEmail: addressData.receiverEmail, receiverPhone: addressData.receiverPhone,
        receiverPhoneCountryCode: addressData.receiverPhoneCountryCode,
        type: addressData.type as "home" | "work" | "other" | "warehouse",
        street: addressData.street, city: addressData.city, state: addressData.state,
        country: addressData.country, zipCode: addressData.zipCode,
        isDefault: addressData.isDefault, coordinates: { latitude: addressData.coordinates.latitude, longitude: addressData.coordinates.longitude },
      };
      if (onSave) {
        await onSave(addressData);
        onClose();
      } else if (customerId) {
        let result;
        if (editingAddressId) {
          result = await customerAddressService.updateAddress(customerId, editingAddressId, addressRequest);
        } else {
          result = await customerAddressService.addAddress(customerId, addressRequest);
        }
        if (result.success) onClose();
        else setError("Failed to save address");
      } else {
        setError("Customer ID is required");
      }
    } catch (err) {
      console.error("Error saving address:", err);
      setError(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-[800px] p-0 overflow-hidden">
          {/* Header */}
          <div className="bg-[#F9A922] text-white flex justify-between items-center py-4 px-6">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5" />
              <DialogTitle className="text-white font-semibold text-base">Enter Shipping Address</DialogTitle>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 border border-red-200 text-sm">{error}</div>
            )}
            <div className="flex flex-col gap-6">
              {/* Company Name */}
              <div>
                <label className="text-sm font-semibold text-[#333] mb-2 block">Company Name *</label>
                <input placeholder="Enter Company Name" value={addressData.companyName} onChange={handleInputChange("companyName")} className={fieldClass} />
              </div>

              {/* Receiver Info Row */}
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="text-sm font-semibold text-[#333] mb-2 block">Receiver Name *</label>
                  <input placeholder="Enter Receiver Name" value={addressData.receiverName} onChange={handleInputChange("receiverName")} className={fieldClass} />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-[#333] mb-2 block">Receiver Email *</label>
                  <input type="email" placeholder="Enter Receiver Email" value={addressData.receiverEmail} onChange={handleInputChange("receiverEmail")} className={fieldClass} />
                </div>
              </div>

              {/* Phone Row */}
              <div className="flex gap-6">
                <div style={{ flex: "0.3" }}>
                  <label className="text-sm font-semibold text-[#333] mb-2 block">Country Code *</label>
                  <select value={addressData.receiverPhoneCountryCode} onChange={handleInputChange("receiverPhoneCountryCode")} className={fieldClass}>
                    {countryCodes.map((c) => <option key={c.code} value={c.code}>{c.code} ({c.country})</option>)}
                  </select>
                </div>
                <div style={{ flex: "0.7" }}>
                  <label className="text-sm font-semibold text-[#333] mb-2 block">Phone Number *</label>
                  <input placeholder="Enter Phone Number" value={addressData.receiverPhone} onChange={handleInputChange("receiverPhone")} className={fieldClass} />
                </div>
              </div>

              {/* Address Type */}
              <div>
                <label className="text-sm font-semibold text-[#333] mb-2 block">Address Type *</label>
                <div className="flex gap-3 flex-wrap">
                  {addressTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = addressData.type === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleSelectChange("type")(type.value)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border font-semibold text-sm transition-colors ${
                          isSelected
                            ? "border-[#F9A922] bg-[#F9A922] text-white"
                            : "border-[#F9A922] text-[#F9A922] bg-transparent hover:bg-[rgba(249,169,34,0.04)]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Street */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-[#333]">Street Address *</label>
                  <button type="button" onClick={() => setMapModalOpen(true)} className="flex items-center gap-1.5 text-xs border border-[#F9A922] text-[#F9A922] px-3 py-1 rounded-lg hover:bg-[#FFFAF1] font-semibold transition-colors">
                    <Map className="w-3.5 h-3.5" /> Choose on Map
                  </button>
                </div>
                <input placeholder="Enter Street Address" value={addressData.street} onChange={handleInputChange("street")} className={fieldClass} />
              </div>

              {/* City, State */}
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="text-sm font-semibold text-[#333] mb-2 block">City *</label>
                  <input placeholder="Enter City" value={addressData.city} onChange={handleInputChange("city")} className={fieldClass} />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-[#333] mb-2 block">State *</label>
                  <input placeholder="Enter State" value={addressData.state} onChange={handleInputChange("state")} className={fieldClass} />
                </div>
              </div>

              {/* Country, ZIP */}
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="text-sm font-semibold text-[#333] mb-2 block">Country *</label>
                  <select value={addressData.country} onChange={handleInputChange("country")} className={fieldClass}>
                    <option value="">Select Country</option>
                    {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-[#333] mb-2 block">ZIP Code *</label>
                  <input placeholder="Enter ZIP Code" value={addressData.zipCode} onChange={handleInputChange("zipCode")} className={fieldClass} />
                </div>
              </div>

              {/* Coordinates */}
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="text-sm font-semibold text-[#333] mb-2 block">Latitude</label>
                  <input placeholder="Enter Latitude" value={addressData.coordinates.latitude} onChange={handleCoordinatesChange("latitude")} className={fieldClass} />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-[#333] mb-2 block">Longitude</label>
                  <input placeholder="Enter Longitude" value={addressData.coordinates.longitude} onChange={handleCoordinatesChange("longitude")} className={fieldClass} />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6 items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => handleSelectChange("isDefault")(!addressData.isDefault)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${addressData.isDefault ? "bg-[#F9A922]" : "bg-gray-200"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${addressData.isDefault ? "translate-x-6" : "translate-x-1"}`} />
                  </div>
                  <span className="text-sm font-semibold text-[#333]">Set as Default Address</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => handleSelectChange("isActive")(!addressData.isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${addressData.isActive ? "bg-[#F9A922]" : "bg-gray-200"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${addressData.isActive ? "translate-x-6" : "translate-x-1"}`} />
                  </div>
                  <span className="text-sm font-semibold text-[#333]">Active Address</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 border-t border-[#E5E7EB]">
            <button onClick={onClose} className="text-sm border border-[#ddd] text-[#666] px-6 py-2 rounded-[30px] hover:bg-gray-50 font-medium transition-colors">Cancel</button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 text-sm bg-[#F9A922] text-white px-6 py-2 rounded-[30px] hover:bg-[#E8981F] disabled:bg-gray-300 font-medium transition-colors"
            >
              {isLoading ? <Spinner size="sm" className="border-white border-t-transparent" /> : <Save className="w-4 h-4" />}
              {isLoading ? "Saving..." : editingAddressId ? "Update Address" : "Save Address"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Map Modal */}
      <Dialog open={mapModalOpen} onOpenChange={() => setMapModalOpen(false)}>
        <DialogContent className="max-w-[1000px] p-0 overflow-hidden">
          <div className="bg-[#F9A922] text-white flex justify-between items-center py-4 px-6">
            <div className="flex items-center gap-3">
              <Map className="w-5 h-5" />
              <DialogTitle className="text-white font-semibold text-base">Select Location on Map</DialogTitle>
            </div>
          </div>
          <div className="p-0">
            <MapSelector
              onLocationSelect={handleMapSelection}
              initialCenter={{
                lat: addressData.coordinates.latitude ? parseFloat(addressData.coordinates.latitude) : 40.7128,
                lng: addressData.coordinates.longitude ? parseFloat(addressData.coordinates.longitude) : -74.006,
              }}
              height="500px"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddressModal;
