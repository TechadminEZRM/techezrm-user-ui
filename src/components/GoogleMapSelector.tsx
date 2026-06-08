"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Search, Navigation, MapPin } from "lucide-react";

interface GoogleMapSelectorProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialCenter?: { lat: number; lng: number };
  height?: string;
}

const MapComponent: React.FC<{
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialCenter: { lat: number; lng: number };
  height: string;
}> = ({ onLocationSelect, initialCenter, height }) => {
  const ref = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (ref.current && !map) {
      if (typeof google === "undefined" || !google.maps) {
        console.error("Google Maps API is not loaded");
        return;
      }
      const newMap = new google.maps.Map(ref.current, {
        center: initialCenter, zoom: 15, mapTypeControl: true, streetViewControl: true,
        fullscreenControl: true, zoomControl: true,
        styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }],
      });
      const pinElement = document.createElement("div");
      pinElement.style.cssText = "width:20px;height:20px;background-color:#F9A922;border:2px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.3);cursor:pointer";
      const newMarker = new google.maps.marker.AdvancedMarkerElement({ position: initialCenter, map: newMap, title: "Selected Location", content: pinElement });
      const newGeocoder = new google.maps.Geocoder();
      let newAutocompleteService = null;
      let newPlacesService = null;
      if (google.maps.places && google.maps.places.AutocompleteService) {
        newAutocompleteService = new google.maps.places.AutocompleteService();
        newPlacesService = new google.maps.places.PlacesService(newMap);
      }
      setMap(newMap); setMarker(newMarker); setGeocoder(newGeocoder);
      setAutocompleteService(newAutocompleteService); setPlacesService(newPlacesService);
      newMap.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const lat = event.latLng.lat(); const lng = event.latLng.lng();
          newMarker.position = event.latLng;
          newGeocoder.geocode({ location: event.latLng }, (results, status) => {
            if (status === "OK" && results && results[0]) onLocationSelect(lat, lng, results[0].formatted_address);
          });
        }
      });
      pinElement.addEventListener("click", () => {
        const position = newMarker.position;
        if (position) {
          const lat = typeof (position as any).lat === "function" ? (position as any).lat() : (position as any).lat;
          const lng = typeof (position as any).lng === "function" ? (position as any).lng() : (position as any).lng;
          newGeocoder.geocode({ location: position }, (results, status) => {
            if (status === "OK" && results && results[0]) onLocationSelect(lat, lng, results[0].formatted_address);
          });
        }
      });
    }
  }, [ref, map, initialCenter, onLocationSelect]);

  const debouncedSearch = useCallback((query: string) => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      if (autocompleteService && query.trim().length > 2) {
        try {
          autocompleteService.getPlacePredictions({ input: query, types: ["address"], componentRestrictions: { country: ["us", "ca", "gb", "au", "in"] } }, (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) { setSuggestions(predictions); setShowSuggestions(true); setSelectedIndex(-1); }
            else { setSuggestions([]); setShowSuggestions(false); }
          });
        } catch (error) { console.error("Error getting place predictions:", error); setSuggestions([]); setShowSuggestions(false); }
      } else { setSuggestions([]); setShowSuggestions(false); }
    }, 300);
  }, [autocompleteService]);

  const handleInputChange = useCallback((value: string) => { setSearchInput(value); debouncedSearch(value); }, [debouncedSearch]);

  const handleSuggestionSelect = useCallback((placeId: string) => {
    if (placesService) {
      try {
        placesService.getDetails({ placeId, fields: ["geometry", "formatted_address", "name"] }, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry?.location) {
            const location = place.geometry.location;
            const lat = location.lat(); const lng = location.lng();
            const address = place.formatted_address || place.name || "";
            if (map) { map.setCenter(location); map.setZoom(15); }
            if (marker) marker.position = location;
            onLocationSelect(lat, lng, address);
            setSearchInput(address); setShowSuggestions(false); setSuggestions([]);
          }
        });
      } catch (error) { console.error("Error getting place details:", error); }
    }
  }, [placesService, map, marker, onLocationSelect]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); setSelectedIndex((p) => p < suggestions.length - 1 ? p + 1 : p); break;
      case "ArrowUp": e.preventDefault(); setSelectedIndex((p) => p > 0 ? p - 1 : -1); break;
      case "Enter": e.preventDefault(); if (selectedIndex >= 0 && selectedIndex < suggestions.length) handleSuggestionSelect(suggestions[selectedIndex].place_id); break;
      case "Escape": setShowSuggestions(false); setSelectedIndex(-1); break;
    }
  }, [showSuggestions, suggestions, selectedIndex, handleSuggestionSelect]);

  const handleSearch = useCallback(() => {
    if (!map || !geocoder || !searchInput.trim()) return;
    geocoder.geocode({ address: searchInput }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat(); const lng = location.lng();
        map.setCenter(location); map.setZoom(15);
        if (marker) marker.position = location;
        onLocationSelect(lat, lng, results[0].formatted_address);
        setShowSuggestions(false);
      }
    });
  }, [map, geocoder, searchInput, marker, onLocationSelect]);

  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation || !map || !marker) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude; const lng = position.coords.longitude;
      const location = new google.maps.LatLng(lat, lng);
      map.setCenter(location); map.setZoom(15); marker.position = location;
      if (geocoder) {
        geocoder.geocode({ location }, (results, status) => {
          if (status === "OK" && results && results[0]) onLocationSelect(lat, lng, results[0].formatted_address);
        });
      }
    }, (error) => console.error("Error getting current location:", error));
  }, [map, marker, geocoder, onLocationSelect]);

  return (
    <div style={{ height }} className="relative">
      {/* Search Box */}
      <div className="absolute top-3 left-3 right-3 z-[1000] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.12)] p-3">
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for an address..."
                value={searchInput}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F9A922] hover:border-[#ccc] transition-colors"
              />
              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 max-h-[200px] overflow-auto z-[1001] shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-[#e0e0e0] rounded-xl bg-white">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.place_id}
                      type="button"
                      onClick={() => handleSuggestionSelect(suggestion.place_id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${selectedIndex === index ? "bg-[#F9A922] text-white" : "hover:bg-[#f5f5f5]"}`}
                    >
                      <MapPin className={`w-4 h-4 flex-shrink-0 ${selectedIndex === index ? "text-white" : "text-[#F9A922]"}`} />
                      <div>
                        <p className={`text-[0.8rem] font-medium ${selectedIndex === index ? "text-white" : "text-[#333]"}`}>{suggestion.structured_formatting.main_text}</p>
                        <p className={`text-[0.7rem] ${selectedIndex === index ? "text-white/80" : "text-[#666]"}`}>{suggestion.structured_formatting.secondary_text}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleSearch} className="flex items-center gap-1.5 bg-[#F9A922] hover:bg-[#E8981F] text-white text-[0.8rem] font-medium px-3 py-2 rounded-lg transition-colors">
              <Search className="w-4 h-4" /> Search
            </button>
            <button onClick={handleCurrentLocation} className="flex items-center gap-1.5 border border-[#F9A922] text-[#F9A922] hover:bg-[rgba(249,169,34,0.04)] text-[0.8rem] font-medium px-2.5 py-2 rounded-lg transition-colors">
              <Navigation className="w-4 h-4" /> My Location
            </button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div ref={ref} className="h-full w-full rounded-lg overflow-hidden" />

      {/* Instructions */}
      <div className="absolute bottom-3 left-3 bg-white/95 rounded-xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.12)] max-w-[280px]">
        <p className="text-[0.75rem] font-semibold text-[#666] mb-1">Instructions:</p>
        {["Type for address suggestions", "Use ↑↓ arrows, Enter to select", "Click map to select location", "Drag marker to adjust"].map((t) => (
          <p key={t} className="text-[0.7rem] text-[#666] mb-0.5">• {t}</p>
        ))}
      </div>
    </div>
  );
};

const render = (status: Status): React.ReactElement => {
  const base = "h-[400px] flex items-center justify-center bg-[#f0f0f0] rounded-lg";
  switch (status) {
    case Status.LOADING: return <div className={base}><p>Loading Google Maps...</p></div>;
    case Status.FAILURE: return <div className={`${base} flex-col gap-4`}><p className="text-red-600">Failed to load Google Maps</p><p className="text-sm text-[#666]">Please check your internet connection and try again.</p></div>;
    default: return <div className={base}><p>Initializing...</p></div>;
  }
};

const GoogleMapSelector: React.FC<GoogleMapSelectorProps> = ({ onLocationSelect, initialCenter = { lat: 40.7128, lng: -74.006 }, height = "500px" }) => {
  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
  if (!apiKey) {
    return (
      <div style={{ height }} className="flex flex-col items-center justify-center bg-[#f0f0f0] rounded-lg gap-3">
        <p className="text-red-600 font-medium">Google Maps API key not found</p>
        <p className="text-sm text-[#666]">Please add NEXT_PUBLIC_MAPS_API_KEY to your environment variables.</p>
      </div>
    );
  }
  return (
    <Wrapper apiKey={apiKey} render={render} libraries={["places", "marker"]}>
      <MapComponent onLocationSelect={onLocationSelect} initialCenter={initialCenter} height={height} />
    </Wrapper>
  );
};

export default GoogleMapSelector;
