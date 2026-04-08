"use client";

import { useEffect, useRef } from "react";
import type { FoodListing } from "@/lib/firestore";

interface Props {
  listings: FoodListing[];
}

export default function MapView({ listings }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (mapInstanceRef.current) return; // Already initialized

    // Dynamically import leaflet (SSR-safe)
    import("leaflet").then((L) => {
      if (!mapRef.current || mapInstanceRef.current) return;

      // Fix default marker icons for bundlers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [19.076, 72.8777], // Mumbai default
        zoom: 12,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Dark tile layer
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '© <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      // Custom green icon
      const greenIcon = L.divIcon({
        html: `<div style="
          width: 32px; height: 32px; border-radius: 50% 50% 0;
          background: linear-gradient(135deg,#22c55e,#16a34a);
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(34,197,94,0.5);
        "></div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -36],
      });

      // Add markers for listings
      listings.forEach((listing) => {
        if (listing.location?.lat && listing.location?.lng) {
          L.marker([listing.location.lat, listing.location.lng], { icon: greenIcon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family:Inter,sans-serif;padding:4px 2px;min-width:160px;">
                <strong style="font-size:14px;">${listing.foodName}</strong><br/>
                <span style="color:#64748b;font-size:12px;">by ${listing.restaurantName}</span><br/>
                <span style="color:#22c55e;font-size:12px;font-weight:600;">${listing.quantity}</span><br/>
                <span style="color:#94a3b8;font-size:11px;">${listing.address}</span>
              </div>
            `);
        }
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when listings change
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === "undefined") return;
    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      // Remove old markers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
      });

      const greenIcon = L.divIcon({
        html: `<div style="
          width: 32px; height: 32px; border-radius: 50% 50% 0;
          background: linear-gradient(135deg,#22c55e,#16a34a);
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(34,197,94,0.5);
        "></div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -36],
      });

      listings.forEach((listing) => {
        if (listing.location?.lat && listing.location?.lng) {
          L.marker([listing.location.lat, listing.location.lng], { icon: greenIcon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family:Inter,sans-serif;padding:4px 2px;min-width:160px;">
                <strong>${listing.foodName}</strong><br/>
                <span style="color:#64748b;font-size:12px;">by ${listing.restaurantName}</span><br/>
                <span style="color:#22c55e;font-size:12px;">${listing.quantity}</span><br/>
                <span style="color:#94a3b8;font-size:11px;">${listing.address}</span>
              </div>
            `);
        }
      });
    });
  }, [listings]);

  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid var(--border)",
        position: "relative",
      }}
    >
      <div ref={mapRef} className="map-container" />
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 1000,
          background: "rgba(15,22,41,0.85)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10,
          padding: "0.5rem 0.875rem",
          fontSize: "0.8rem",
          color: "var(--text-secondary)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          pointerEvents: "none",
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
        {listings.length} available near you
      </div>
    </div>
  );
}
