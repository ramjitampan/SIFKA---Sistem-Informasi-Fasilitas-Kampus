import React, { useState } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap, useMapEvents } from 'react-leaflet';
import { Maximize2, Minimize2, X, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useMapStore from '../../store/mapStore';
import 'leaflet/dist/leaflet.css';

// CartoDB DarkMatter is a great dark theme for maps
const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

function MapStateController() {
  const { center, zoom, setMapState } = useMapStore();
  const map = useMap();

  React.useEffect(() => {
    if (center) map.setView(center, zoom);
  }, [center, zoom]);

  useMapEvents({
    moveend: () => {
      const newCenter = map.getCenter();
      const newZoom = map.getZoom();
      setMapState([newCenter.lat, newCenter.lng], newZoom);
    }
  });

  return null;
}

function GPSControl({ onGPS }) {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  const handleGPS = (e) => {
    e.stopPropagation();
    if (!navigator.geolocation) {
      toast.error('Browser tidak mendukung geolokasi');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.flyTo([latitude, longitude], 18);
        if (onGPS) onGPS({ lat: latitude, lng: longitude });
        toast.success('Lokasi ditemukan');
        setLoading(false);
      },
      () => {
        toast.error('Gagal mendapatkan lokasi');
        setLoading(false);
      }
    );
  };

  return (
    <div className="leaflet-top leaflet-left" style={{ marginTop: 12, marginLeft: 12 }}>
      <div className="leaflet-control leaflet-bar" style={{ border: 'none' }}>
        <button
          onClick={handleGPS}
          disabled={loading}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
            color: loading ? 'var(--accent)' : 'var(--text-primary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow)', transition: 'all 0.2s',
          }}
          title="Tentukan Lokasi Saya"
        >
          <Navigation size={18} className={loading ? 'animate-pulse' : ''} fill={loading ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
}

export const Map = ({ 
  children, 
  style = {},
  minZoom = 14,
  maxZoom = 19,
  scrollWheelZoom = true,
  allowExpand = true,
  onGPS = null,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const MapContent = (
    <>
      <MapContainer 
        scrollWheelZoom={scrollWheelZoom}
        style={{ height: '100%', width: '100%', background: 'var(--bg-base)' }}
        zoomControl={false}
        minZoom={minZoom}
        maxZoom={maxZoom}
      >
        <MapStateController />
        <TileLayer url={DARK_TILES} attribution={ATTRIBUTION} />
        <ZoomControl position="bottomright" />
        {onGPS && <GPSControl onGPS={onGPS} />}
        {children}
      </MapContainer>
      
      {allowExpand && (
        <button
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          style={{
            position: 'absolute', top: 12, right: 12, zIndex: 1000,
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
            color: 'var(--text-primary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow)',
          }}
          title={isExpanded ? "Minimize" : "Expand Map"}
        >
          {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      )}
    </>
  );

  return (
    <>
      <div style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: 400,
        borderRadius: 'var(--radius-lg)', 
        overflow: 'hidden', 
        border: '1px solid var(--border-strong)',
        position: 'relative',
        ...style 
      }}>
        {MapContent}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 10000,
              background: 'var(--bg-base)', padding: 20,
              display: 'flex', flexDirection: 'column', gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}>Interactive Map View</div>
              <button
                onClick={() => setIsExpanded(false)}
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
                  color: 'var(--text-primary)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ flex: 1, borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border-strong)', position: 'relative' }}>
              {MapContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
