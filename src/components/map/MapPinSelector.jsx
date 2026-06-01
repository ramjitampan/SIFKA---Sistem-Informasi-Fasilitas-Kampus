import React, { useState, useEffect } from 'react';
import { useMapEvents, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapPin } from 'lucide-react';

const selectorIcon = L.divIcon({
  html: renderToStaticMarkup(
    <div style={{
      width: 44, height: 44,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--accent)', color: '#fff',
      borderRadius: '50%', border: '4px solid rgba(255,255,255,0.2)',
      boxShadow: '0 4px 20px rgba(79,124,255,0.4)',
      animation: 'pulse 2s infinite',
    }}>
      <MapPin size={22} fill="currentColor" />
    </div>
  ),
  className: 'pin-selector-icon',
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

export const MapPinSelector = ({ onSelect, position }) => {
  const [pos, setPos] = useState(position);
  const mapInstance = useMap();

  useEffect(() => {
    if (position) {
      setPos(position);
    }
  }, [position]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPos([lat, lng]);
      onSelect({ lat, lng });
      mapInstance.flyTo(e.latlng, mapInstance.getZoom());
    },
  });

  return pos ? (
    <Marker position={pos} icon={selectorIcon}>
      <Popup closeButton={false}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
          Lokasi Terpilih
        </div>
      </Popup>
    </Marker>
  ) : null;
};
