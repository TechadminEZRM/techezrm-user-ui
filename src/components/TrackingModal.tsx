"use client";

import React from "react";
import { X, CheckCircle2, Clock, Circle } from "lucide-react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import { formatDate } from "@/utils/dateUtils";

const getMarkerColor = (status: "completed" | "current" | "pending") => {
  switch (status) {
    case "completed": return "#4CAF50";
    case "current": return "#F9A922";
    case "pending": return "#9E9E9E";
    default: return "#F9A922";
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

const statusBadge = (status: string) => {
  if (status === "completed") return "bg-green-100 text-green-800";
  if (status === "current") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-700 border border-gray-300";
};

const TrackingModal: React.FC<TrackingModalProps> = ({ open, onClose, trackingNumber, trackingData, trackingPoints }) => {
  const [mapState, setMapState] = React.useState({ center: { lat: 0, lng: 0 }, zoom: 2 });
  const [mapRef, setMapRef] = React.useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = React.useState<number | null>(null);
  const [isZooming, setIsZooming] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [currentAnimationIndex, setCurrentAnimationIndex] = React.useState(0);
  const [movingDotPosition, setMovingDotPosition] = React.useState<{ lat: number; lng: number } | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY || "AIzaSyAzEg_-JsYTeeI7OTXghH1utbSFCJ5IlOg",
    libraries: ["places"],
  });

  const handleMapLoad = (map: google.maps.Map) => {
    setMapRef(map);
    if (trackingPoints && trackingPoints.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      trackingPoints.forEach((point) => {
        if (point?.lat && point?.lng) bounds.extend(new google.maps.LatLng(point.lat, point.lng));
      });
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      const listener = google.maps.event.addListener(map, "bounds_changed", () => {
        const z = map.getZoom();
        if (z && z > 8) map.setZoom(8);
        google.maps.event.removeListener(listener);
      });
    }
  };

  const handleFitToRoute = () => {
    if (mapRef && trackingPoints && trackingPoints.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      trackingPoints.forEach((p) => { if (p?.lat && p?.lng) bounds.extend(new google.maps.LatLng(p.lat, p.lng)); });
      mapRef.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      const listener = google.maps.event.addListener(mapRef, "bounds_changed", () => {
        const z = mapRef.getZoom();
        if (z && z > 8) mapRef.setZoom(8);
        google.maps.event.removeListener(listener);
      });
    }
  };

  const startJourneyAnimation = () => {
    if (!trackingData || trackingData.length === 0 || isAnimating) return;
    setIsAnimating(true);
    setCurrentAnimationIndex(0);
    const animateToNextPoint = (index: number) => {
      if (index >= trackingData.length) { setIsAnimating(false); setMovingDotPosition(null); return; }
      const point = trackingData[index];
      if (point?.coordinates && mapRef) {
        const [lng, lat] = point.coordinates;
        setSelectedLocation(point.id);
        setMovingDotPosition({ lat, lng });
        mapRef.panTo({ lat, lng });
        setTimeout(() => { setCurrentAnimationIndex(index + 1); animateToNextPoint(index + 1); }, 2000);
      }
    };
    animateToNextPoint(0);
  };

  const stopJourneyAnimation = () => { setIsAnimating(false); setCurrentAnimationIndex(0); setMovingDotPosition(null); };

  const handleLocationClick = (point: TrackingData) => {
    if (mapRef && point?.coordinates) {
      const [lng, lat] = point.coordinates;
      setSelectedLocation(point?.id);
      setIsZooming(true);
      const zoomLevel = point.status === "current" ? 10 : 8;
      mapRef.panTo({ lat, lng });
      setTimeout(() => {
        mapRef.setZoom(zoomLevel);
        setTimeout(() => setIsZooming(false), 500);
      }, 300);
      setMapState({ center: { lat, lng }, zoom: zoomLevel });
    }
  };

  if (!open) return null;

  return (
    <>
      <style>{`@keyframes zoomIn{0%{transform:scale(1);box-shadow:0 4px 12px rgba(255,107,53,0.2)}50%{transform:scale(1.05);box-shadow:0 8px 25px rgba(255,107,53,0.4)}100%{transform:scale(1);box-shadow:0 4px 12px rgba(255,107,53,0.2)}}.zoom-animation{animation:zoomIn 0.8s ease-in-out}`}</style>

      {/* Backdrop */}
      <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/40" onClick={onClose}>
        <div
          className="bg-white rounded-lg w-[95%] md:w-[90%] lg:w-[80%] max-w-[1200px] max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#e0e0e0]">
            <div className="flex items-center gap-3">
              <span className="text-[#F9A922] text-xl">📍</span>
              <div>
                <h2 className="text-xl font-semibold text-[#1a365d]">Track Your Package</h2>
                <p className="text-sm text-[#666]">Tracking Number: {trackingNumber || "N/A"}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-[#666] hover:text-[#333] hover:bg-[#f5f5f5] rounded-full p-1.5 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* Map */}
            <div className="flex-1 relative bg-[#f0f0f0] min-h-[500px] overflow-hidden">
              {loadError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#666] z-10">
                  <p className="text-lg font-medium">Error loading map</p>
                  <p className="text-sm">Please check your Google Maps API key</p>
                </div>
              )}
              {!isLoaded ? (
                <div className="absolute inset-0 flex items-center justify-center text-[#666] z-10">
                  <p className="text-lg">Loading map...</p>
                </div>
              ) : (
                <div className="h-[500px] w-full">
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={mapState.center}
                    zoom={mapState.zoom}
                    onLoad={handleMapLoad}
                    options={{ styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }], disableDefaultUI: false, zoomControl: true, mapTypeControl: true, scaleControl: true, streetViewControl: false, rotateControl: false, fullscreenControl: true }}
                  >
                    {trackingPoints && trackingPoints.length > 1 && (
                      <Polyline path={trackingPoints.map((p) => ({ lat: p?.lat || 0, lng: p?.lng || 0 }))} options={{ strokeColor: "#F9A922", strokeOpacity: 1.0, strokeWeight: 5, geodesic: true, clickable: false, zIndex: 1 }} />
                    )}
                    {movingDotPosition && (
                      <Marker position={movingDotPosition} icon={{ url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" fill="#F9A922" stroke="white" stroke-width="2"/><circle cx="10" cy="10" r="4" fill="white"/></svg>`)}`, scaledSize: new google.maps.Size(20, 20), anchor: new google.maps.Point(10, 10) }} options={{ clickable: false, zIndex: 10 }} />
                    )}
                    {trackingPoints?.map((point, index) => (
                      <Marker
                        key={index}
                        position={{ lat: point?.lat || 0, lng: point?.lng || 0 }}
                        icon={{ url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="18" fill="${getMarkerColor(point?.status || "pending")}" stroke="white" stroke-width="3"/><text x="20" y="26" text-anchor="middle" fill="white" font-size="16" font-family="Arial">${point?.icon || "📍"}</text></svg>`)}`, scaledSize: new google.maps.Size(40, 40), anchor: new google.maps.Point(20, 20) }}
                        onClick={() => { const td = trackingData?.find((t) => t?.coordinates?.[0] === point?.lng && t?.coordinates?.[1] === point?.lat); if (td) handleLocationClick(td); }}
                      />
                    ))}
                  </GoogleMap>
                </div>
              )}

              {/* Custom controls */}
              {isLoaded && (
                <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-[1000]">
                  <button
                    onClick={isAnimating ? stopJourneyAnimation : startJourneyAnimation}
                    title={isAnimating ? "Stop Journey" : "Start Journey"}
                    className="w-10 h-10 rounded flex items-center justify-center text-white text-base font-bold transition-all hover:scale-[1.08]"
                    style={{ backgroundColor: isAnimating ? "#dc3545" : "#28a745", boxShadow: `0 2px 8px ${isAnimating ? "rgba(220,53,69,0.3)" : "rgba(40,167,69,0.3)"}` }}
                  >
                    {isAnimating ? "⏹️" : "▶️"}
                  </button>
                  <button
                    onClick={handleFitToRoute}
                    title="Fit to Route"
                    className="w-10 h-10 bg-[#F9A922] rounded flex items-center justify-center text-base font-bold text-white shadow-[0_2px_8px_rgba(255,107,53,0.3)] hover:bg-[#E8981F] hover:scale-[1.08] transition-all"
                  >
                    🗺️
                  </button>
                </div>
              )}
            </div>

            {/* Tracking History */}
            <div className="w-[400px] border-l border-[#e0e0e0] overflow-y-auto bg-[#fafafa]">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[20px] top-5 bottom-5 w-0.5 bg-[#e0e0e0] rounded z-0" />

                  {trackingData?.map((point) => (
                    <div key={point?.id} className="mb-6 relative">
                      {/* Timeline dot */}
                      <div
                        className="absolute left-[11px] top-[15px] w-5 h-5 rounded-full bg-white flex items-center justify-center z-[2] shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                        style={{ border: `3px solid ${point?.status === "completed" ? "#4CAF50" : point?.status === "current" ? "#F9A922" : "#e0e0e0"}` }}
                      >
                        {point?.status === "completed" ? (
                          <CheckCircle2 className="w-3 h-3 text-[#4CAF50]" />
                        ) : point?.status === "current" ? (
                          <Clock className="w-3 h-3 text-[#F9A922]" />
                        ) : (
                          <Circle className="w-3 h-3 text-[#e0e0e0]" />
                        )}
                      </div>

                      {/* Content Card */}
                      <div
                        onClick={() => handleLocationClick(point)}
                        className={`ml-[40px] p-3 rounded cursor-pointer relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(255,107,53,0.4)] hover:border-2 hover:border-[#F9A922] hover:bg-[#fff5f2] ${selectedLocation === point?.id ? "bg-[#fff5f2] shadow-[0_4px_12px_rgba(255,107,53,0.2)] border-2 border-[#F9A922]" : point?.status === "current" ? "border-2 border-[#F9A922] bg-white" : "border border-[#e0e0e0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]"} ${selectedLocation === point?.id && isZooming ? "zoom-animation" : ""}`}
                      >
                        {/* Arrow */}
                        <div className="absolute left-[-8px] top-[15px] w-0 h-0 border-t-[8px] border-b-[8px] border-r-[8px] border-t-transparent border-b-transparent border-r-white z-[1]" />

                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">{point?.location || "N/A"}</span>
                          <span className={`text-[10px] ${selectedLocation === point?.id && isZooming ? "text-[#4CAF50] font-bold" : "text-[#F9A922]"} opacity-70`}>
                            {selectedLocation === point?.id && isZooming ? "Zooming..." : "Click to focus"}
                          </span>
                        </div>
                        <p className="text-sm text-[#666] mb-2">{point?.description || "N/A"}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#999]">{formatDate(point?.timestamp)}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge(point?.status || "pending")}`}>
                            {point?.status || "pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackingModal;
