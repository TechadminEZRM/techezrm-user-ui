"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { countriesHandler } from "@/api/handlers/countriesHandler";
import type { Country } from "@/api/services/countries";

interface PhoneNumberInputProps {
  value?: string;
  onChange?: (phoneNumber: string, countryCode: string, phoneCode: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
  defaultCountryCode?: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value = "",
  onChange,
  label = "Phone Number",
  placeholder = "Enter phone number",
  required = false,
  error = false,
  helperText,
  disabled = false,
  fullWidth = true,
  size = "medium",
  defaultCountryCode = "IN",
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [phoneNumber, setPhoneNumber] = useState(value);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await countriesHandler.getCountries();
        setCountries(data);
        const def = data.find((c) => c.countryCode === defaultCountryCode);
        if (def) setSelectedCountry(def);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [defaultCountryCode]);

  useEffect(() => { setPhoneNumber(value); }, [value]);

  // Click outside handler
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setOpen(false);
    setSearchQuery("");
    onChange?.(phoneNumber, country.countryCode, country.phoneCode);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhoneNumber(val);
    if (onChange && selectedCountry) onChange(val, selectedCountry.countryCode, selectedCountry.phoneCode);
  };

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phoneCode.includes(searchQuery) ||
      c.countryCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inputH = size === "small" ? "h-9" : "h-10";

  return (
    <div className={`relative ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label className="block text-sm font-medium text-heading mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex">
        {/* Country Selector Button */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            disabled={disabled}
            className={`flex items-center gap-1.5 px-3 ${inputH} border border-r-0 border-line-light rounded-l-lg bg-surface hover:bg-line transition-colors text-sm min-w-[80px] disabled:cursor-not-allowed`}
          >
            {loading ? (
              <Spinner size="sm" />
            ) : selectedCountry ? (
              <>
                <span className="text-xl leading-none">{selectedCountry.emoji}</span>
                <span className="text-xs font-medium text-dim">{selectedCountry.phoneCode}</span>
              </>
            ) : (
              <span className="text-sm text-faint">+1</span>
            )}
            <ChevronDown className="w-4 h-4 text-dim" />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute z-50 top-full left-0 mt-1 w-72 bg-white border border-line-light rounded-xl shadow-lg max-h-96 flex flex-col">
              {/* Search */}
              <div className="p-3 border-b border-line-light">
                <input
                  placeholder="Search countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 px-3 text-sm border border-line-light rounded-lg focus:outline-none focus:ring-1 focus:ring-brand"
                  autoFocus
                />
              </div>
              {/* List */}
              <div className="overflow-y-auto flex-1">
                {filtered.map((country) => (
                  <button
                    key={country.countryCode}
                    type="button"
                    onMouseDown={() => handleCountrySelect(country)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-light transition-colors text-left"
                  >
                    <span className="text-xl leading-none">{country.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-heading truncate">{country.name}</p>
                      <p className="text-xs text-soft">{country.continent}</p>
                    </div>
                    <span className="text-[11px] border border-brand text-brand rounded px-1.5 py-px flex-shrink-0">{country.phoneCode}</span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="px-4 py-3 text-sm text-soft text-center">No countries found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`flex-1 ${inputH} px-4 border border-line-light rounded-r-lg text-sm text-heading placeholder:text-soft focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? "border-red-500" : ""}`}
        />
      </div>
      {helperText && (
        <p className={`text-xs mt-1 ${error ? "text-red-500" : "text-soft"}`}>{helperText}</p>
      )}
    </div>
  );
};

export default PhoneNumberInput;
