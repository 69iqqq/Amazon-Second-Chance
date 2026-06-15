"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issues in Next.js/Leaflet
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const createCustomIcon = (type: string) => {
  const isNGO = type === 'NGO';
  const color = isNGO ? '#C7511F' : '#007600';
  const label = isNGO ? 'NGO' : 'KIRANA';
  
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="
        background-color: ${color};
        padding: 4px 8px;
        border-radius: 4px;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 10px;
        font-family: sans-serif;
        white-space: nowrap;
      ">
        ${label}
      </div>
      <div style="
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid ${color};
        margin: 0 auto;
        margin-top: -2px;
      "></div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 30],
    popupAnchor: [0, -30],
  });
};

export default function LeafletMap({ partners }: { partners: any[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fix default icons if necessary
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    });
  }, []);

  if (!mounted) {
    return <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div>;
  }

  // Center around Agartala
  const center: [number, number] = [23.8315, 91.2868];

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      zoomControl={true}
    >
      {/* Positron tile layer (clean, road-focused, no shop labels) */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      
      {partners.map((partner) => {
        if (!partner.latitude || !partner.longitude) return null;
        
        return (
          <Marker 
            key={partner.id} 
            position={[Number(partner.latitude), Number(partner.longitude)]}
            icon={createCustomIcon(partner.type)}
          >
            <Popup>
              <div className="text-[#0f1111] font-sans !m-0 !p-1">
                <strong className="block text-[14px] text-[#007185] mb-1">{partner.name}</strong>
                <span className="text-[12px] block text-[#565959]">{partner.address}</span>
                <span className="text-[10px] font-bold mt-2 inline-block px-1.5 py-0.5 rounded-sm bg-[#f7fafa] border border-[#D5D9D9]">
                  {partner.type === 'NGO' ? 'NGO Partner' : 'Kirana Drop-off'}
                </span>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
