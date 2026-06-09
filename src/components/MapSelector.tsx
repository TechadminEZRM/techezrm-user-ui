"use client";

import React, { useCallback, useRef, useState } from "react";
import { Search, Navigation, MapPin } from "lucide-react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { mapsService, AutocompleteResult, GeocodeResult } from "@/api/services/maps";
import { Spinner } from "@/components/ui/spinner";

interface MapSelectorProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialCenter?: { lat: number; lng: number };
  height?: string;
}

const MapSelector: React.FC<MapSelectorProps> = ({
  onLocationSelect,
  initialCenter = { lat: 40.7128, lng: -74.006 },
  height = "500px",
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(initialCenter);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    libraries: ["places"],
  });

  const handleMapLoad = useCallback((map: google.maps.Map) => { setMapRef(map); }, []);

  const debouncedSearch = useCallback((query: string) => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(async () => {
      if (query.trim().length > 2) {
        try {
          setIsLoading(true);
          const results = await mapsService.getAutocompleteSuggestions(query, currentLocation.lat, currentLocation.lng, 5000, "address");
          setSuggestions(results); setShowSuggestions(true); setSelectedIndex(-1);
        } catch (error) { console.error("Error getting autocomplete suggestions:", error); setSuggestions([]); setShowSuggestions(false); }
        finally { setIsLoading(false); }
      } else { setSuggestions([]); setShowSuggestions(false); }
    }, 300);
  }, [currentLocation]);

  const handleInputChange = useCallback((value: string) => { setSearchInput(value); debouncedSearch(value); }, [debouncedSearch]);

  const handleSuggestionSelect = useCallback(async (placeId: string) => {
    try {
      setIsLoading(true);
      const placeDetails = await mapsService.getPlaceDetails(placeId, "geometry,formatted_address,name");
      if (placeDetails.geometry?.location) {
        const { lat, lng } = placeDetails.geometry.location;
        const address = placeDetails.formatted_address || placeDetails.name || "";
        setCurrentLocation({ lat, lng });
        onLocationSelect(lat, lng, address);
        setSearchInput(address); setShowSuggestions(false); setSuggestions([]);
        if (mapRef) mapRef.panTo({ lat, lng });
      }
    } catch (error) { console.error("Error getting place details:", error); }
    finally { setIsLoading(false); }
  }, [onLocationSelect, mapRef]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); setSelectedIndex((p) => p < suggestions.length - 1 ? p + 1 : p); break;
      case "ArrowUp": e.preventDefault(); setSelectedIndex((p) => p > 0 ? p - 1 : -1); break;
      case "Enter": e.preventDefault(); if (selectedIndex >= 0 && selectedIndex < suggestions.length) handleSuggestionSelect(suggestions[selectedIndex].place_id); break;
      case "Escape": setShowSuggestions(false); setSelectedIndex(-1); break;
    }
  }, [showSuggestions, suggestions, selectedIndex, handleSuggestionSelect]);

  const handleSearch = useCallback(async () => {
    if (!searchInput.trim()) return;
    try {
      setIsLoading(true);
      const results = await mapsService.geocode(searchInput);
      if (results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        const address = results[0].formatted_address;
        setCurrentLocation({ lat, lng });
        onLocationSelect(lat, lng, address);
        setShowSuggestions(false);
        if (mapRef) mapRef.panTo({ lat, lng });
      }
    } catch (error) { console.error("Error searching for address:", error); }
    finally { setIsLoading(false); }
  }, [searchInput, onLocationSelect, mapRef]);

  const handleCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) return;
    try {
      setIsLoading(true);
      const position = await new Promise<GeolocationPosition>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
      const lat = position.coords.latitude; const lng = position.coords.longitude;
      setCurrentLocation({ lat, lng });
      if (mapRef) mapRef.panTo({ lat, lng });
      try {
        const results = await mapsService.reverseGeocode(lat, lng);
        if (results.length > 0) { onLocationSelect(lat, lng, results[0].formatted_address); setSearchInput(results[0].formatted_address); }
        else onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      } catch { onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`); }
    } catch (error) { console.error("Error getting current location:", error); }
    finally { setIsLoading(false); }
  }, [onLocationSelect, mapRef]);

  const handleMapClick = useCallback(async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;
    const lat = event.latLng.lat(); const lng = event.latLng.lng();
    try {
      setIsLoading(true);
      const results = await mapsService.reverseGeocode(lat, lng);
      if (results.length > 0) { setCurrentLocation({ lat, lng }); onLocationSelect(lat, lng, results[0].formatted_address); setSearchInput(results[0].formatted_address); }
    } catch (error) { console.error("Error getting address for clicked location:", error); }
    finally { setIsLoading(false); }
  }, [onLocationSelect]);

  return (
    <div style={{ height }} className="relative">
      {/* Search Box */}
      <div className="absolute top-3 left-3 right-3 z-[1000] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.12)] p-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for an address..."
              value={searchInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              disabled={isLoading}
              className="w-full border border-line-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand hover:border-line-light disabled:bg-paper transition-colors"
            />
            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-[200px] overflow-auto z-[1001] shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-line-light rounded-xl bg-white">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.place_id}
                    type="button"
                    onClick={() => handleSuggestionSelect(suggestion.place_id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${selectedIndex === index ? "bg-brand text-white" : "hover:bg-paper"}`}
                  >
                    <MapPin className={`w-4 h-4 flex-shrink-0 ${selectedIndex === index ? "text-white" : "text-brand"}`} />
                    <div>
                      <p className={`text-[0.8rem] font-medium ${selectedIndex === index ? "text-white" : "text-body"}`}>{suggestion.structured_formatting.main_text}</p>
                      <p className={`text-[0.7rem] ${selectedIndex === index ? "text-white/80" : "text-dim"}`}>{suggestion.structured_formatting.secondary_text}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleSearch} disabled={isLoading} className="flex items-center gap-1.5 bg-brand hover:bg-brand-hover disabled:bg-line-light text-white text-[0.8rem] font-medium px-3 py-2 rounded-lg transition-colors">
            <Search className="w-4 h-4" /> Search
          </button>
          <button onClick={handleCurrentLocation} disabled={isLoading} className="flex items-center gap-1.5 border border-brand text-brand hover:bg-[rgba(249,169,34,0.04)] disabled:border-line-light disabled:text-line-light text-[0.8rem] font-medium px-2.5 py-2 rounded-lg transition-colors">
            <Navigation className="w-4 h-4" /> My Location
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-full w-full rounded-lg overflow-hidden relative">
        {loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-dim z-10">
            <p className="text-lg font-medium">Error loading map</p>
            <p className="text-sm">Please check your Google Maps API key</p>
          </div>
        )}
        {!isLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center text-dim z-10">
            <p className="text-lg">Loading map...</p>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={currentLocation}
            zoom={12}
            onLoad={handleMapLoad}
            onClick={handleMapClick}
            options={{ styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }], disableDefaultUI: false, zoomControl: true, mapTypeControl: true, scaleControl: true, streetViewControl: false, rotateControl: false, fullscreenControl: true }}
          >
            <Marker
              position={currentLocation}
              icon={{ url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="var(--color-brand)" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="white"/></svg>`)}`, scaledSize: new google.maps.Size(24, 24), anchor: new google.maps.Point(12, 12) }}
            />
          </GoogleMap>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-[200]">
            <div className="flex flex-col items-center gap-2">
              <Spinner size="sm" className="border-brand border-t-transparent" />
              <span className="text-sm text-dim">Loading...</span>
            </div>
          </div>
        )}

        {/* Coordinates */}
        <div className="absolute bottom-3 right-3 bg-white/95 rounded px-2 py-1 text-xs text-dim shadow-[0_2px_4px_rgba(0,0,0,0.1)] border border-black/10 z-[1000]">
          {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
        </div>

        {/* Attribution */}
        <div className="absolute bottom-3 left-3 bg-white/90 rounded px-2 py-1 text-[0.7rem] text-dim z-[1000]">
          © Google Maps
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-3 left-3 bg-white/95 rounded-xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.12)] max-w-[280px]">
        <p className="text-[0.75rem] font-semibold text-dim mb-1">Instructions:</p>
        {["Type for address suggestions", "Use ↑↓ arrows, Enter to select", "Click map to select location", 'Use "My Location" for GPS'].map((t) => (
          <p key={t} className="text-[0.7rem] text-dim mb-0.5">• {t}</p>
        ))}
      </div>
    </div>
  );
};

export default MapSelector;
