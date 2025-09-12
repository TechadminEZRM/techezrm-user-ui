"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
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
  const [marker, setMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (ref.current && !map) {
      // Check if Google Maps API is loaded
      if (typeof google === "undefined" || !google.maps) {
        console.error("Google Maps API is not loaded");
        return;
      }

      const newMap = new google.maps.Map(ref.current, {
        center: initialCenter,
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      // Create a pin element for the AdvancedMarkerElement
      const pinElement = document.createElement("div");
      pinElement.style.width = "20px";
      pinElement.style.height = "20px";
      pinElement.style.backgroundColor = "#ff6b35";
      pinElement.style.border = "2px solid white";
      pinElement.style.borderRadius = "50%";
      pinElement.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
      pinElement.style.cursor = "pointer";

      const newMarker = new google.maps.marker.AdvancedMarkerElement({
        position: initialCenter,
        map: newMap,
        title: "Selected Location",
        content: pinElement,
      });

      const newGeocoder = new google.maps.Geocoder();

      // Check if Places API is available
      let newAutocompleteService = null;
      let newPlacesService = null;

      if (google.maps.places && google.maps.places.AutocompleteService) {
        newAutocompleteService = new google.maps.places.AutocompleteService();
        newPlacesService = new google.maps.places.PlacesService(newMap);
      } else {
        console.warn("Google Maps Places API is not available");
      }

      setMap(newMap);
      setMarker(newMarker);
      setGeocoder(newGeocoder);
      setAutocompleteService(newAutocompleteService);
      setPlacesService(newPlacesService);

      // Add click listener to map
      newMap.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();

          newMarker.position = event.latLng;

          // Reverse geocode to get address
          newGeocoder.geocode({ location: event.latLng }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              onLocationSelect(lat, lng, results[0].formatted_address);
            }
          });
        }
      });

      // Add click listener to marker for position updates
      pinElement.addEventListener("click", () => {
        const position = newMarker.position;
        if (position) {
          const lat =
            typeof position.lat === "function" ? position.lat() : position.lat;
          const lng =
            typeof position.lng === "function" ? position.lng() : position.lng;

          // Reverse geocode to get address
          newGeocoder.geocode({ location: position }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              onLocationSelect(lat, lng, results[0].formatted_address);
            }
          });
        }
      });
    }
  }, [ref, map, initialCenter, onLocationSelect]);

  // Debounced search function for autocomplete
  const debouncedSearch = useCallback(
    (query: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        if (autocompleteService && query.trim().length > 2) {
          try {
            autocompleteService.getPlacePredictions(
              {
                input: query,
                types: ["address"],
                componentRestrictions: {
                  country: ["us", "ca", "gb", "au", "in"],
                }, // Restrict to common countries
              },
              (predictions, status) => {
                if (
                  status === google.maps.places.PlacesServiceStatus.OK &&
                  predictions
                ) {
                  setSuggestions(predictions);
                  setShowSuggestions(true);
                  setSelectedIndex(-1);
                } else {
                  setSuggestions([]);
                  setShowSuggestions(false);
                }
              }
            );
          } catch (error) {
            console.error("Error getting place predictions:", error);
            setSuggestions([]);
            setShowSuggestions(false);
          }
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 300); // 300ms debounce delay
    },
    [autocompleteService]
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
    (placeId: string) => {
      if (placesService) {
        try {
          placesService.getDetails(
            {
              placeId: placeId,
              fields: ["geometry", "formatted_address", "name"],
            },
            (place, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                place &&
                place.geometry &&
                place.geometry.location
              ) {
                const location = place.geometry.location;
                const lat = location.lat();
                const lng = location.lng();
                const address = place.formatted_address || place.name || "";

                if (map && location) {
                  map.setCenter(location);
                  map.setZoom(15);
                }

                if (marker && location) {
                  marker.position = location;
                }

                onLocationSelect(lat, lng, address);
                setSearchInput(address);
                setShowSuggestions(false);
                setSuggestions([]);
              }
            }
          );
        } catch (error) {
          console.error("Error getting place details:", error);
        }
      }
    },
    [placesService, map, marker, onLocationSelect]
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

  const handleSearch = useCallback(() => {
    if (!map || !geocoder || !searchInput.trim()) return;

    geocoder.geocode({ address: searchInput }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();

        map.setCenter(location);
        map.setZoom(15);

        if (marker) {
          marker.position = location;
        }

        onLocationSelect(lat, lng, results[0].formatted_address);
        setShowSuggestions(false);
      }
    });
  }, [map, geocoder, searchInput, marker, onLocationSelect]);

  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation || !map || !marker) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const location = new google.maps.LatLng(lat, lng);

        map.setCenter(location);
        map.setZoom(15);
        marker.position = location;

        if (geocoder) {
          geocoder.geocode({ location }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              onLocationSelect(lat, lng, results[0].formatted_address);
            }
          });
        }
      },
      (error) => {
        console.error("Error getting current location:", error);
      }
    );
  }, [map, marker, geocoder, onLocationSelect]);

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
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1, position: "relative" }}>
              <TextField
                ref={searchInputRef}
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
              }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              startIcon={<MyLocation />}
              size="small"
              onClick={handleCurrentLocation}
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
              }}
            >
              My Location
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Map Container */}
      <Box
        ref={ref}
        sx={{
          height: "100%",
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
        }}
      />

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
          • Drag marker to adjust
        </Typography>
      </Box>
    </Box>
  );
};

const render = (status: Status): React.ReactElement => {
  switch (status) {
    case Status.LOADING:
      return (
        <Box
          sx={{
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f0f0",
            borderRadius: 2,
          }}
        >
          <Typography>Loading Google Maps...</Typography>
        </Box>
      );
    case Status.FAILURE:
      return (
        <Box
          sx={{
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f0f0",
            borderRadius: 2,
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography color="error">Failed to load Google Maps</Typography>
          <Typography variant="body2" color="text.secondary">
            Please check your internet connection and try again.
          </Typography>
        </Box>
      );
    default:
      return (
        <Box
          sx={{
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f0f0",
            borderRadius: 2,
          }}
        >
          <Typography>Initializing...</Typography>
        </Box>
      );
  }
};

const GoogleMapSelector: React.FC<GoogleMapSelectorProps> = ({
  onLocationSelect,
  initialCenter = { lat: 40.7128, lng: -74.006 },
  height = "500px",
}) => {
  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <Box
        sx={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
          borderRadius: 2,
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography color="error">Google Maps API key not found</Typography>
        <Typography variant="body2" color="text.secondary">
          Please add NEXT_PUBLIC_MAPS_API_KEY to your environment variables.
        </Typography>
      </Box>
    );
  }

  return (
    <Wrapper apiKey={apiKey} render={render} libraries={["places", "marker"]}>
      <MapComponent
        onLocationSelect={onLocationSelect}
        initialCenter={initialCenter}
        height={height}
      />
    </Wrapper>
  );
};

export default GoogleMapSelector;
