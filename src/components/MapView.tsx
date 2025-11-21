import { useEffect, useRef, useState, memo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Customer } from "@/data/customers";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom orange marker icon - optimized
const orangeIcon = L.divIcon({
  className: "custom-marker",
  html: `
    <div style="
      background: linear-gradient(135deg, #ff8c00, #ffa500);
      width: 28px;
      height: 28px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid #000;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      position: relative;
    ">
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        color: #000;
        font-size: 14px;
        font-weight: bold;
      ">🚐</div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

interface MapViewProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
}

const MapView = memo(({ customers, selectedCustomer }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<Map<number, L.Marker>>(new Map());
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Create map centered on Brazil with performance optimizations
    map.current = L.map(mapContainer.current, {
      center: [-15.7801, -47.9292],
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: true,
      preferCanvas: true,
      zoomAnimation: true,
      fadeAnimation: false,
      markerZoomAnimation: false,
    });

    // Add OpenStreetMap tiles with performance optimizations
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      updateWhenIdle: true,
      updateWhenZooming: false,
      keepBuffer: 2,
    }).addTo(map.current);

    setIsMapReady(true);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers for all customers
  useEffect(() => {
    if (!map.current || !isMapReady) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current.clear();

    // Add new markers
    customers.forEach((customer) => {
      if (!map.current) return;

      const marker = L.marker([customer.lat, customer.lng], {
        icon: orangeIcon,
      }).addTo(map.current);

      marker.bindPopup(`
        <div style="text-align: center; padding: 8px; min-width: 150px;">
          <strong style="color: #ff8c00; font-size: 16px; display: block; margin-bottom: 4px;">
            ${customer.name}
          </strong>
          <span style="color: #666; font-size: 14px;">
            ${customer.city}, ${customer.state}
          </span>
        </div>
      `);

      markers.current.set(customer.id, marker);
    });
  }, [customers, isMapReady]);

  // Handle selected customer
  useEffect(() => {
    if (!map.current || !selectedCustomer) return;

    const marker = markers.current.get(selectedCustomer.id);
    if (marker) {
      map.current.setView([selectedCustomer.lat, selectedCustomer.lng], 12, {
        animate: true,
        duration: 0.5,
      });
      setTimeout(() => marker.openPopup(), 300);
    }
  }, [selectedCustomer]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 z-0" />
      <style>{`
        .leaflet-popup-content-wrapper {
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid #ff8c00;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(255, 140, 0, 0.3);
        }
        .leaflet-popup-tip {
          background: rgba(0, 0, 0, 0.95);
          border-top: 2px solid #ff8c00;
          border-right: 2px solid #ff8c00;
        }
        .leaflet-container {
          background: #0a0a0a;
        }
        .custom-marker {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
        .leaflet-tile {
          will-change: transform;
        }
      `}</style>
    </div>
  );
});

export default MapView;
