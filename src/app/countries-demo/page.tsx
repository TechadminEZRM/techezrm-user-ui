"use client";

import React, { useState, useEffect } from "react";
import { Search, Globe, Phone, MapPin } from "lucide-react";
import { countriesHandler } from "@/api/handlers/countriesHandler";
import CountrySelect from "@/components/CountrySelect";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { Spinner } from "@/components/ui/spinner";
import type { Country } from "@/api/services/countries";

const CountriesDemoPage: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const countriesData = await countriesHandler.getCountries();
        setCountries(countriesData);
        setFilteredCountries(countriesData);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = countries.filter(
        (country) =>
          country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.continent.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.currency.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [searchQuery, countries]);

  const handlePhoneChange = (number: string, countryCode: string, code: string) => {
    setPhoneNumber(number);
    setPhoneCountryCode(countryCode);
    setPhoneCode(code);
  };

  const continents = Array.from(new Set(countries.map((c) => c.continent))).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-body mb-8">Countries API Demo</h1>

      {/* API Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-sm text-blue-800">
        <strong>API Endpoint:</strong> /public/constants/countries<br />
        <strong>Total Countries:</strong> {countries.length}<br />
        <strong>Continents:</strong> {continents.join(", ")}
      </div>

      {/* Component Demos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Country Select Demo */}
        <div className="bg-white border border-line-light rounded-lg p-6 h-full">
          <h2 className="text-base font-semibold text-body mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand" />
            Country Select Component
          </h2>
          <CountrySelect
            value={selectedCountry}
            onChange={setSelectedCountry}
            label="Select Country"
            placeholder="Choose a country"
            showPhoneCode={true}
            showCurrency={true}
            showContinent={true}
          />
          {selectedCountry && (
            <p className="mt-4 text-sm text-dim">Selected: {selectedCountry}</p>
          )}
        </div>

        {/* Phone Number Input Demo */}
        <div className="bg-white border border-line-light rounded-lg p-6 h-full">
          <h2 className="text-base font-semibold text-body mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-brand" />
            Phone Number Input Component
          </h2>
          <PhoneNumberInput
            value={phoneNumber}
            onChange={handlePhoneChange}
            label="Phone Number"
            placeholder="Enter phone number"
            defaultCountryCode="IN"
          />
          {phoneNumber && (
            <p className="mt-4 text-sm text-dim">
              Number: {phoneCode} {phoneNumber}<br />
              Country Code: {phoneCountryCode}
            </p>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-line-light rounded-lg p-6 mb-8">
        <h2 className="text-base font-semibold text-body mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-brand" />
          Search & Filter Countries
        </h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dim" />
          <input
            className="w-full border border-line-light rounded pl-9 pr-3 py-2 text-sm text-body placeholder:text-faint focus:outline-none focus:border-brand transition-colors"
            placeholder="Search countries by name, continent, or currency..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {continents.map((continent) => (
            <button
              key={continent}
              onClick={() => setSearchQuery(continent)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${searchQuery === continent ? "bg-brand border-brand text-white" : "border-line-light text-dim hover:border-brand hover:text-brand"}`}
            >
              {continent}
            </button>
          ))}
        </div>
      </div>

      {/* Countries List */}
      <div className="bg-white border border-line-light rounded-lg p-6">
        <h2 className="text-base font-semibold text-body mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand" />
          Countries List ({filteredCountries.length} results)
        </h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCountries.map((country) => (
              <div
                key={country.countryCode}
                className="border border-line-light rounded-lg p-3 h-full hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[1.5rem]">{country.emoji}</span>
                  <span className="text-sm font-semibold text-body">{country.name}</span>
                </div>
                <p className="text-xs text-dim mb-2">{country.continent}</p>
                <div className="flex gap-1 flex-wrap">
                  <span className="text-[0.7rem] border border-line-light rounded-full px-2 py-0.5 text-dim">{country.phoneCode}</span>
                  <span className="text-[0.7rem] border border-line-light rounded-full px-2 py-0.5 text-dim">{country.currency}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredCountries.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-sm text-dim">No countries found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountriesDemoPage;
