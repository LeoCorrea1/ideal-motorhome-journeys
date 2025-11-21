import { useEffect, useRef, useState } from "react";
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

// Custom orange marker icon
const orangeIcon = L.divIcon({
  className: "custom-marker",
  html: `
    <div style="
      background: linear-gradient(135deg, #ff8c00, #ffa500);
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid #000;
      box-shadow: 0 0 20px rgba(255, 140, 0, 0.6);
      position: relative;
    ">
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        color: #000;
        font-size: 16px;
        font-weight: bold;
      ">🚐</div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface MapViewProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
}

const MapView = ({ customers, selectedCustomer }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<Map<number, L.Marker>>(new Map());
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Create map centered on Brazil
    map.current = L.map(mapContainer.current, {
      center: [-15.7801, -47.9292],
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
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
        duration: 1,
      });
      marker.openPopup();
    }
  }, [selectedCustomer]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 z-0" />
      <style>{`
        .leaflet-popup-content-wrapper {
          background: rgba(0, 0, 0, 0.9);
          border: 2px solid #ff8c00;
          border-radius: 12px;
          box-shadow: 0 0 30px rgba(255, 140, 0, 0.4);
        }
        .leaflet-popup-tip {
          background: rgba(0, 0, 0, 0.9);
          border-top: 2px solid #ff8c00;
          border-right: 2px solid #ff8c00;
        }
        .leaflet-container {
          background: #0a0a0a;
        }
        .custom-marker {
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
        }
      `}</style>
    </div>
  );
};

export default MapView;
