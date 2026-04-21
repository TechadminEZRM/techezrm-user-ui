"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { Search, MyLocation, Place } from "@mui/icons-material";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import {
  mapsService,
  AutocompleteResult,
  GeocodeResult,
} from "@/api/services/maps";

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

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Handle map load
  const handleMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
  }, []);

  // Debounced search function for autocomplete
  const debouncedSearch = useCallback(
    (query: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        if (query.trim().length > 2) {
          try {
            setIsLoading(true);
            const results = await mapsService.getAutocompleteSuggestions(
              query,
              currentLocation.lat,
              currentLocation.lng,
              5000,
              "address"
            );
            setSuggestions(results);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          } catch (error) {
            console.error("Error getting autocomplete suggestions:", error);
            setSuggestions([]);
            setShowSuggestions(false);
          } finally {
            setIsLoading(false);
          }
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 300); // 300ms debounce delay
    },
    [currentLocation]
  );

  // Handle input change with debouncing
  const handleInputChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback(
    async (placeId: string) => {
      try {
        setIsLoading(true);
        const placeDetails = await mapsService.getPlaceDetails(
          placeId,
          "geometry,formatted_address,name"
        );

        if (placeDetails.geometry?.location) {
          const location = placeDetails.geometry.location;
          const lat = location.lat;
          const lng = location.lng;
          const address =
            placeDetails.formatted_address || placeDetails.name || "";

          setCurrentLocation({ lat, lng });
          onLocationSelect(lat, lng, address);
          setSearchInput(address);
          setShowSuggestions(false);
          setSuggestions([]);

          // Pan map to selected location
          if (mapRef) {
            mapRef.panTo({ lat, lng });
          }
        }
      } catch (error) {
        console.error("Error getting place details:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [onLocationSelect]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            handleSuggestionSelect(suggestions[selectedIndex].place_id);
          }
          break;
        case "Escape":
          setShowSuggestions(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [showSuggestions, suggestions, selectedIndex, handleSuggestionSelect]
  );

  const handleSearch = useCallback(async () => {
    if (!searchInput.trim()) return;

    try {
      setIsLoading(true);
      const results = await mapsService.geocode(searchInput);

      if (results.length > 0) {
        const location = results[0].geometry.location;
        const lat = location.lat;
        const lng = location.lng;
        const address = results[0].formatted_address;

        setCurrentLocation({ lat, lng });
        onLocationSelect(lat, lng, address);
        setShowSuggestions(false);

        // Pan map to selected location
        if (mapRef) {
          mapRef.panTo({ lat, lng });
        }
      }
    } catch (error) {
      console.error("Error searching for address:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchInput, onLocationSelect]);

  const handleCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) return;

    try {
      setIsLoading(true);
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const location = { lat, lng };

      setCurrentLocation(location);

      // Pan map to current location
      if (mapRef) {
        mapRef.panTo({ lat, lng });
      }

      // Get address for current location
      try {
        const results = await mapsService.reverseGeocode(lat, lng);
        if (results.length > 0) {
          const address = results[0].formatted_address;
          onLocationSelect(lat, lng, address);
          setSearchInput(address);
        } else {
          onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      } catch (error) {
        console.error("Error getting address for current location:", error);
        onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } catch (error) {
      console.error("Error getting current location:", error);
    } finally {
      setIsLoading(false);
    }
  }, [onLocationSelect]);

  // Handle map click
  const handleMapClick = useCallback(
    async (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;

      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      try {
        setIsLoading(true);
        const results = await mapsService.reverseGeocode(lat, lng);
        if (results.length > 0) {
          const address = results[0].formatted_address;
          setCurrentLocation({ lat, lng });
          onLocationSelect(lat, lng, address);
          setSearchInput(address);
        }
      } catch (error) {
        console.error("Error getting address for clicked location:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [onLocationSelect]
  );

  return (
    <Box sx={{ height, position: "relative" }}>
      {/* Search Box */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          right: 12,
          zIndex: 1000,
          backgroundColor: "white",
          borderRadius: 1.5,
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          p: 1.5,
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Box sx={{ flex: 1, position: "relative" }}>
              <TextField
                placeholder="Search for an address..."
                variant="outlined"
                fullWidth
                size="small"
                value={searchInput}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  // Delay hiding suggestions to allow clicking on them
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                disabled={isLoading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    fontSize: "0.875rem",
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#ccc",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ff6b35",
                    },
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "0.875rem",
                    py: 1,
                  },
                }}
              />

              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <Paper
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    mt: 0.5,
                    maxHeight: 200,
                    overflow: "auto",
                    zIndex: 1001,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                    border: "1px solid #e0e0e0",
                    borderRadius: 1.5,
                  }}
                >
                  <List sx={{ py: 0 }}>
                    {suggestions.map((suggestion, index) => (
                      <ListItem
                        key={suggestion.place_id}
                        onClick={() =>
                          handleSuggestionSelect(suggestion.place_id)
                        }
                        sx={{
                          cursor: "pointer",
                          backgroundColor:
                            selectedIndex === index ? "#ff6b35" : "transparent",
                          color: selectedIndex === index ? "white" : "inherit",
                          py: 0.5,
                          px: 1,
                          "&:hover": {
                            backgroundColor:
                              selectedIndex === index ? "#e55a2b" : "#f5f5f5",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Place
                          sx={{
                            mr: 1.5,
                            fontSize: 16,
                            color:
                              selectedIndex === index ? "white" : "#ff6b35",
                          }}
                        />
                        <ListItemText
                          primary={suggestion.structured_formatting.main_text}
                          secondary={
                            suggestion.structured_formatting.secondary_text
                          }
                          primaryTypographyProps={{
                            fontWeight: 500,
                            fontSize: "0.8rem",
                          }}
                          secondaryTypographyProps={{
                            fontSize: "0.7rem",
                            color:
                              selectedIndex === index
                                ? "rgba(255,255,255,0.8)"
                                : "text.secondary",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>

            <Button
              variant="contained"
              startIcon={<Search />}
              size="small"
              onClick={handleSearch}
              disabled={isLoading}
              sx={{
                backgroundColor: "#ff6b35",
                color: "white",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.8rem",
                px: 2,
                py: 0.5,
                minWidth: "auto",
                "&:hover": {
                  backgroundColor: "#e55a2b",
                },
                "&:disabled": {
                  backgroundColor: "#ccc",
                },
              }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              startIcon={<MyLocation />}
              size="small"
              onClick={handleCurrentLocation}
              disabled={isLoading}
              sx={{
                borderColor: "#ff6b35",
                color: "#ff6b35",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.8rem",
                px: 1.5,
                py: 0.5,
                minWidth: "auto",
                "&:hover": {
                  borderColor: "#e55a2b",
                  backgroundColor: "rgba(255, 107, 53, 0.04)",
                },
                "&:disabled": {
                  borderColor: "#ccc",
                  color: "#ccc",
                },
              }}
            >
              My Location
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Map Container */}
      <Box
        sx={{
          height: "100%",
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Google Maps Component */}
        {loadError && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "#666",
              zIndex: 1000,
            }}
          >
            <Typography variant="h6">Error loading map</Typography>
            <Typography variant="body2">
              Please check your Google Maps API key
            </Typography>
          </Box>
        )}

        {!isLoaded ? (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "#666",
              zIndex: 1000,
            }}
          >
            <Typography variant="h6">Loading map...</Typography>
          </Box>
        ) : (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={currentLocation}
            zoom={12}
            onLoad={handleMapLoad}
            onClick={handleMapClick}
            options={{
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
                },
              ],
              disableDefaultUI: false,
              zoomControl: true,
              mapTypeControl: true,
              scaleControl: true,
              streetViewControl: false,
              rotateControl: false,
              fullscreenControl: true,
            }}
          >
            {/* Location Marker */}
            <Marker
              position={currentLocation}
              icon={{
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#ff6b35" stroke="white" stroke-width="2"/>
                    <circle cx="12" cy="12" r="4" fill="white"/>
                  </svg>
                `)}`,
                scaledSize: new google.maps.Size(24, 24),
                anchor: new google.maps.Point(12, 12),
              }}
            />
          </GoogleMap>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 200,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  border: "2px solid #ff6b35",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.8rem" }}
              >
                Loading...
              </Typography>
            </Box>
          </Box>
        )}

        {/* Coordinates Display */}
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            right: 12,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 1,
            p: 1,
            fontSize: "0.75rem",
            color: "#666",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            border: "1px solid rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
        </Box>

        {/* Map Attribution */}
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: 0.5,
            px: 1,
            py: 0.5,
            fontSize: "0.7rem",
            color: "#666",
            zIndex: 1000,
          }}
        >
          © Google Maps
        </Box>
      </Box>

      {/* Instructions */}
      <Box
        sx={{
          position: "absolute",
          bottom: 12,
          left: 12,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: 1.5,
          p: 1.5,
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          maxWidth: 280,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 0.5, fontWeight: 600, fontSize: "0.75rem" }}
        >
          Instructions:
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 0.3, fontSize: "0.7rem" }}
        >
          • Type for address suggestions
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 0.3, fontSize: "0.7rem" }}
        >
          • Use ↑↓ arrows, Enter to select
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 0.3, fontSize: "0.7rem" }}
        >
          • Click map to select location
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", fontSize: "0.7rem" }}
        >
          • Use "My Location" for GPS
        </Typography>
      </Box>
    </Box>
  );
};

export default MapSelector;
