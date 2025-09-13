"use client";

import React from "react";
import { Box, Typography, Modal, IconButton, Chip } from "@mui/material";
import {
  Timeline,
  Close,
  CheckCircle,
  AccessTime,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
  Circle,
  Polygon,
  Polyline,
} from "@react-google-maps/api";
import { formatDate } from "@/utils/dateUtils";

// Get marker color based on status
const getMarkerColor = (status: "completed" | "current" | "pending") => {
  switch (status) {
    case "completed":
      return "#4CAF50";
    case "current":
      return "#ff6b35";
    case "pending":
      return "#9E9E9E";
    default:
      return "#ff6b35";
  }
};

interface TrackingData {
  id: number;
  location: string;
  coordinates: [number, number];
  status: "completed" | "current" | "pending";
  timestamp: string;
  description: string;
  icon: string;
}

interface TrackingPoint {
  lat: number;
  lng: number;
  icon: string;
  label: string;
  status: "completed" | "current" | "pending";
}

interface TrackingModalProps {
  open: boolean;
  onClose: () => void;
  trackingNumber?: string;
  trackingData: TrackingData[];
  trackingPoints: TrackingPoint[];
}

const TrackingModal: React.FC<TrackingModalProps> = ({
  open,
  onClose,
  trackingNumber,
  trackingData,
  trackingPoints,
}) => {
  const [mapState, setMapState] = React.useState({
    center: {
      lat: 0, // World center
      lng: 0,
    },
    zoom: 2, // World view
  });

  const [mapRef, setMapRef] = React.useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = React.useState<number | null>(
    null
  );
  const [isZooming, setIsZooming] = React.useState(false);
  const [currentAnimationIndex, setCurrentAnimationIndex] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [movingDotPosition, setMovingDotPosition] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_MAPS_API_KEY ||
      "AIzaSyAzEg_-JsYTeeI7OTXghH1utbSFCJ5IlOg",
    libraries: ["places"],
  });

  const handleMapLoad = (map: google.maps.Map) => {
    setMapRef(map);
    console.log("Google Maps loaded successfully");

    // Fit all tracking points in the map view
    if (trackingPoints && trackingPoints.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      trackingPoints.forEach((point) => {
        if (point?.lat && point?.lng) {
          bounds.extend(new google.maps.LatLng(point.lat, point.lng));
        }
      });

      // Fit bounds with padding
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });

      // Set a minimum zoom level to prevent too close zoom
      const listener = google.maps.event.addListener(
        map,
        "bounds_changed",
        () => {
          const currentZoom = map.getZoom();
          if (currentZoom && currentZoom > 8) {
            map.setZoom(8);
          }
          google.maps.event.removeListener(listener);
        }
      );
    }
  };

  const handleZoomIn = () => {
    setMapState((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom + 1, 20),
    }));
  };

  const handleZoomOut = () => {
    setMapState((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom - 1, 1),
    }));
  };

  const handleFitToRoute = () => {
    if (mapRef && trackingPoints && trackingPoints.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      trackingPoints.forEach((point) => {
        if (point?.lat && point?.lng) {
          bounds.extend(new google.maps.LatLng(point.lat, point.lng));
        }
      });

      // Fit bounds with padding
      mapRef.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });

      // Set a minimum zoom level to prevent too close zoom
      const listener = google.maps.event.addListener(
        mapRef,
        "bounds_changed",
        () => {
          const currentZoom = mapRef.getZoom();
          if (currentZoom && currentZoom > 8) {
            mapRef.setZoom(8);
          }
          google.maps.event.removeListener(listener);
        }
      );
    }
  };

  const startJourneyAnimation = () => {
    if (!trackingData || trackingData.length === 0 || isAnimating) return;

    setIsAnimating(true);
    setCurrentAnimationIndex(0);

    const animateToNextPoint = (index: number) => {
      if (index >= trackingData.length) {
        setIsAnimating(false);
        setMovingDotPosition(null);
        return;
      }

      const point = trackingData[index];
      if (point?.coordinates && mapRef) {
        const [lng, lat] = point.coordinates;

        // Set selected location
        setSelectedLocation(point.id);

        // Set moving dot position
        setMovingDotPosition({ lat, lng });

        // Smooth pan to the location
        mapRef.panTo({ lat, lng });

        // Move to next point after delay
        setTimeout(() => {
          setCurrentAnimationIndex(index + 1);
          animateToNextPoint(index + 1);
        }, 2000); // 2 seconds at each location
      }
    };

    animateToNextPoint(0);
  };

  const stopJourneyAnimation = () => {
    setIsAnimating(false);
    setCurrentAnimationIndex(0);
    setMovingDotPosition(null);
  };

  const handleLocationClick = (point: TrackingData) => {
    if (mapRef && point?.coordinates) {
      const [lng, lat] = point.coordinates;

      // Set selected location and zooming state
      setSelectedLocation(point?.id);
      setIsZooming(true);

      // Determine zoom level based on status
      const zoomLevel = point.status === "current" ? 10 : 8;

      // Smooth animated pan and zoom to the location with easing
      mapRef.panTo({ lat, lng });

      // Add smooth zoom animation with delay for better visual effect
      setTimeout(() => {
        mapRef.setZoom(zoomLevel);

        // Reset zooming state after animation completes
        setTimeout(() => {
          setIsZooming(false);
        }, 500);
      }, 300);

      // Update map state with new center and zoom
      setMapState({
        center: { lat, lng },
        zoom: zoomLevel,
      });

      console.log(
        `Map focused on: ${point?.location} at ${lat}, ${lng} with zoom ${zoomLevel}`
      );
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes zoomIn {
          0% {
            transform: scale(1);
            box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
          }
        }

        .zoom-animation {
          animation: zoomIn 0.8s ease-in-out;
        }
      `}</style>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="tracking-modal-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            width: { xs: "95%", md: "90%", lg: "80%" },
            maxWidth: 1200,
            maxHeight: "90vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 3,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Timeline sx={{ color: "#ff6b35", fontSize: 28 }} />
              <Box>
                <Typography variant="h5" fontWeight="600" color="#1a365d">
                  Track Your Package
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tracking Number: {trackingNumber || "N/A"}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose} sx={{ color: "#666" }}>
              <Close />
            </IconButton>
          </Box>

          {/* Modal Content */}
          <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
            {/* Map Section */}
            <Box
              sx={{
                flex: 1,
                position: "relative",
                backgroundColor: "#f0f0f0",
                minHeight: 500,
                height: "100%",
                overflow: "hidden",
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
                <Box sx={{ height: 500, width: "100%" }}>
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={mapState.center}
                    zoom={mapState.zoom}
                    onLoad={handleMapLoad}
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
                    {/* Render clean route line from start to end */}
                    {trackingPoints && trackingPoints.length > 1 && (
                      <Polyline
                        path={trackingPoints.map((point) => ({
                          lat: point?.lat || 0,
                          lng: point?.lng || 0,
                        }))}
                        options={{
                          strokeColor: "#ff6b35",
                          strokeOpacity: 1.0,
                          strokeWeight: 5,
                          geodesic: true,
                          clickable: false,
                          zIndex: 1,
                        }}
                      />
                    )}

                    {/* Render moving dot during animation */}
                    {movingDotPosition && (
                      <Marker
                        position={movingDotPosition}
                        icon={{
                          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="8" 
                                    fill="#ff6b35" 
                                    stroke="white" 
                                    stroke-width="2"/>
                            <circle cx="10" cy="10" r="4" 
                                    fill="white"/>
                          </svg>
                        `)}`,
                          scaledSize: new google.maps.Size(20, 20),
                          anchor: new google.maps.Point(10, 10),
                        }}
                        options={{
                          clickable: false,
                          zIndex: 10,
                        }}
                      />
                    )}

                    {/* Render tracking markers */}
                    {trackingPoints?.map((point, index) => (
                      <Marker
                        key={index}
                        position={{
                          lat: point?.lat || 0,
                          lng: point?.lng || 0,
                        }}
                        icon={{
                          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="20" r="18" 
                                    fill="${getMarkerColor(
                                      point?.status || "pending"
                                    )}" 
                                    stroke="white" 
                                    stroke-width="3"/>
                            <text x="20" y="26" text-anchor="middle" fill="white" font-size="16" font-family="Arial">${
                              point?.icon || "📍"
                            }</text>
                          </svg>
                        `)}`,
                          scaledSize: new google.maps.Size(40, 40),
                          anchor: new google.maps.Point(20, 20),
                        }}
                        onClick={() => {
                          // Find the corresponding tracking data point
                          const trackingPoint = trackingData?.find(
                            (td) =>
                              td?.coordinates?.[0] === point?.lng &&
                              td?.coordinates?.[1] === point?.lat
                          );
                          if (trackingPoint) {
                            handleLocationClick(trackingPoint);
                          }
                        }}
                      />
                    ))}
                  </GoogleMap>
                </Box>
              )}

              {/* Custom Map Controls */}
              {isLoaded && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    zIndex: 1000,
                  }}
                >
                  {/* Start Journey Animation Button */}
                  <Box
                    onClick={
                      isAnimating ? stopJourneyAnimation : startJourneyAnimation
                    }
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: isAnimating ? "#dc3545" : "#28a745",
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: `0 2px 8px ${
                        isAnimating
                          ? "rgba(220, 53, 69, 0.3)"
                          : "rgba(40, 167, 69, 0.3)"
                      }`,
                      "&:hover": {
                        backgroundColor: isAnimating ? "#c82333" : "#218838",
                        transform: "scale(1.08)",
                        transition: "all 0.2s ease",
                      },
                    }}
                    title={isAnimating ? "Stop Journey" : "Start Journey"}
                  >
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "white",
                        userSelect: "none",
                      }}
                    >
                      {isAnimating ? "⏹️" : "▶️"}
                    </Typography>
                  </Box>

                  {/* Fit to Route Button */}
                  <Box
                    onClick={handleFitToRoute}
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#ff6b35",
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(255, 107, 53, 0.3)",
                      "&:hover": {
                        backgroundColor: "#e55a2b",
                        transform: "scale(1.08)",
                        transition: "all 0.2s ease",
                      },
                    }}
                    title="Fit to Route"
                  >
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "white",
                        userSelect: "none",
                      }}
                    >
                      🗺️
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Map Attribution */}
            </Box>

            {/* Tracking Points List */}
            <Box
              sx={{
                width: 400,
                borderLeft: "1px solid #e0e0e0",
                overflowY: "auto",
                backgroundColor: "#fafafa",
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                  Tracking History
                </Typography>

                {/* Vertical Timeline */}
                <Box sx={{ position: "relative" }}>
                  {/* Timeline Line */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 20,
                      top: 20,
                      bottom: 20,
                      width: 2,
                      backgroundColor: "#e0e0e0",
                      borderRadius: 1,
                    }}
                  />

                  {trackingData?.map((point) => (
                    <Box key={point?.id} sx={{ mb: 3, position: "relative" }}>
                      {/* Timeline Dot */}
                      <Box
                        sx={{
                          position: "absolute",
                          left: 11,
                          top: 15,
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          backgroundColor: "white",
                          border: `3px solid ${
                            point?.status === "completed"
                              ? "#4CAF50"
                              : point?.status === "current"
                              ? "#ff6b35"
                              : "#e0e0e0"
                          }`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 2,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        {point?.status === "completed" ? (
                          <CheckCircle
                            sx={{ fontSize: 12, color: "#4CAF50" }}
                          />
                        ) : point?.status === "current" ? (
                          <AccessTime sx={{ fontSize: 12, color: "#ff6b35" }} />
                        ) : (
                          <RadioButtonUnchecked
                            sx={{ fontSize: 12, color: "#e0e0e0" }}
                          />
                        )}
                      </Box>

                      {/* Content Card */}
                      <Box
                        onClick={() => handleLocationClick(point)}
                        className={
                          selectedLocation === point?.id && isZooming
                            ? "zoom-animation"
                            : ""
                        }
                        sx={{
                          ml: 5,
                          p: 2,
                          backgroundColor:
                            selectedLocation === point?.id
                              ? "#fff5f2"
                              : "white",
                          borderRadius: 1,
                          boxShadow:
                            selectedLocation === point?.id
                              ? "0 4px 12px rgba(255, 107, 53, 0.2)"
                              : "0 1px 3px rgba(0,0,0,0.1)",
                          border:
                            selectedLocation === point?.id
                              ? "2px solid #ff6b35"
                              : point?.status === "current"
                              ? "2px solid #ff6b35"
                              : "1px solid #e0e0e0",
                          position: "relative",
                          cursor: "pointer",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          overflow: "hidden",
                          "&:hover": {
                            transform: "translateY(-4px) scale(1.02)",
                            boxShadow: "0 12px 30px rgba(255, 107, 53, 0.4)",
                            border: "2px solid #ff6b35",
                            backgroundColor: "#fff5f2",
                            "&::before": {
                              transform: "translateX(0)",
                            },
                          },
                          "&:active": {
                            transform: "translateY(-2px) scale(0.98)",
                            transition: "transform 0.1s ease",
                          },
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(90deg, transparent, rgba(255, 107, 53, 0.1), transparent)",
                            transform: "translateX(-100%)",
                            transition: "transform 0.6s ease",
                            zIndex: 0,
                          },
                          "& > *": {
                            position: "relative",
                            zIndex: 1,
                          },
                        }}
                      >
                        {/* Arrow pointing to timeline */}
                        <Box
                          sx={{
                            position: "absolute",
                            left: -8,
                            top: 15,
                            width: 0,
                            height: 0,
                            borderTop: "8px solid transparent",
                            borderBottom: "8px solid transparent",
                            borderRight: "8px solid white",
                            zIndex: 1,
                          }}
                        />

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight="600">
                            {point?.location || "N/A"}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color:
                                selectedLocation === point?.id && isZooming
                                  ? "#4CAF50"
                                  : "#ff6b35",
                              fontSize: "10px",
                              opacity: 0.7,
                              fontWeight:
                                selectedLocation === point?.id && isZooming
                                  ? "bold"
                                  : "normal",
                            }}
                          >
                            {selectedLocation === point?.id && isZooming
                              ? "Zooming..."
                              : "Click to focus"}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {point?.description || "N/A"}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(point?.timestamp)}
                          </Typography>
                          <Chip
                            label={point?.status || "pending"}
                            size="small"
                            color={
                              point?.status === "completed"
                                ? "success"
                                : point?.status === "current"
                                ? "warning"
                                : "default"
                            }
                            variant={
                              point?.status === "pending"
                                ? "outlined"
                                : "filled"
                            }
                          />
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default TrackingModal;
