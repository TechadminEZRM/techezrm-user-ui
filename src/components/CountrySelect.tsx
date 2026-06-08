"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { countriesHandler } from "@/api/handlers/countriesHandler";
import type { Country } from "@/api/services/countries";

interface CountrySelectProps {
  value?: string;
  onChange?: (countryCode: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
  showPhoneCode?: boolean;
  showCurrency?: boolean;
  showContinent?: boolean;
  filterByContinent?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  label = "Country",
  placeholder = "Select a country",
  required = false,
  error = false,
  helperText,
  disabled = false,
  fullWidth = true,
  size = "medium",
  showPhoneCode = false,
  showCurrency = false,
  showContinent = false,
  filterByContinent,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const data = filterByContinent
          ? await countriesHandler.getCountriesByContinent(filterByContinent)
          : await countriesHandler.getCountries();
        setCountries(data);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, [filterByContinent]);

  useEffect(() => {
    if (value && countries.length > 0) {
      const found = countries.find((c) => c.countryCode === value);
      setSelectedCountry(found || null);
      setInputValue(found ? `${found.emoji} ${found.name}` : "");
    } else {
      setSelectedCountry(null);
      setInputValue("");
    }
  }, [value, countries]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        // Restore display value if nothing selected
        if (selectedCountry) setInputValue(`${selectedCountry.emoji} ${selectedCountry.name}`);
        else setInputValue("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [selectedCountry]);

  const getOptionLabel = (option: Country) => {
    let lbl = `${option.emoji} ${option.name}`;
    if (showPhoneCode) lbl += ` (${option.phoneCode})`;
    if (showCurrency) lbl += ` - ${option.currency}`;
    if (showContinent) lbl += ` [${option.continent}]`;
    return lbl;
  };

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(inputValue.replace(/[^\w\s]/g, "").trim().toLowerCase()) ||
      c.countryCode.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (country: Country) => {
    setSelectedCountry(country);
    setInputValue(`${country.emoji} ${country.name}`);
    setOpen(false);
    onChange?.(country.countryCode);
  };

  const inputHeight = size === "small" ? "h-9" : "h-10";

  return (
    <div ref={containerRef} className={`relative ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label className="block text-sm font-medium text-[#1F2A44] mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          className={`flex ${inputHeight} w-full rounded-lg border pr-10 pl-4 py-2 text-sm text-[#1F2A44] placeholder:text-[#737791] focus:outline-none focus:ring-2 focus:ring-[#F9A922] focus:border-[#F9A922] disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? "border-red-500" : "border-[#e0e0e0]"} bg-white`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {loading ? <Spinner size="sm" /> : <ChevronDown className="w-4 h-4 text-[#737791]" />}
        </div>
      </div>

      {open && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#e0e0e0] rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[#737791]">No countries found</div>
          ) : (
            filtered.map((country) => (
              <button
                key={country.countryCode}
                type="button"
                onMouseDown={() => handleSelect(country)}
                className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-[#FFFAF1] transition-colors text-left"
              >
                <span className="text-xl leading-none mt-0.5">{country.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-[#1F2A44]">{country.name}</p>
                  <div className="flex gap-2 mt-0.5 flex-wrap">
                    {showPhoneCode && <span className="text-[10px] border border-[#e0e0e0] rounded px-1.5 py-px text-[#737791]">{country.phoneCode}</span>}
                    {showCurrency && <span className="text-[10px] border border-[#e0e0e0] rounded px-1.5 py-px text-[#737791]">{country.currency}</span>}
                    {showContinent && <span className="text-[10px] border border-[#e0e0e0] rounded px-1.5 py-px text-[#737791]">{country.continent}</span>}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {helperText && (
        <p className={`text-xs mt-1 ${error ? "text-red-500" : "text-[#737791]"}`}>{helperText}</p>
      )}
    </div>
  );
};

export default CountrySelect;
