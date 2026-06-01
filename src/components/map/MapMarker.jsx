import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapPin, Building2, AlertCircle, Clock, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

const createIcon = (color, IconContent) => {
  const isLucide = typeof IconContent !== 'string';
  
  const html = renderToStaticMarkup(
    <div style={{
      width: 40, height: 40, 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      border: `2px solid ${color}`, borderRadius: '50%',
      color: color,
      boxShadow: `0 0 15px ${color}40`,
      fontSize: 18,
    }}>
      {isLucide ? <IconContent size={20} /> : <span>{IconContent}</span>}
    </div>
  );
  
  return L.divIcon({
    html,
    className: 'custom-map-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const ICONS = {
  building: createIcon('#a855f7', Building2), // Purple
  facility: createIcon('#4f7cff', MapPin),    // Accent/Blue
  report:   createIcon('#ef4444', AlertCircle), 
};

// Status-specific report icons
const REPORT_STATUS_ICONS = {
  pending:     createIcon('#f59e0b', Clock),        // Yellow
  in_progress: createIcon('#4f7cff', RefreshCw),    // Blue/Accent
  resolved:    createIcon('#22c55e', CheckCircle2), // Green
  rejected:    createIcon('#ef4444', XCircle),      // Red
};

export const MapMarker = ({ position, type = 'facility', status = null, icon: customIcon = null, color = null, onClick, children }) => {
  let icon = ICONS[type] || ICONS.facility;

  // Priority 1: Custom Icon and Color (from category)
  if (customIcon || color) {
    icon = createIcon(color || '#4f7cff', customIcon || MapPin);
  }
  // Priority 2: Status-specific (for reports)
  else if (type === 'report' && status && REPORT_STATUS_ICONS[status]) {
    icon = REPORT_STATUS_ICONS[status];
  }
  
  return (
    <Marker 
      position={position} 
      icon={icon}
      eventHandlers={{
        click: (e) => {
          L.DomEvent.stopPropagation(e);
          if (onClick) onClick(e);
        }
      }}
    >
      {children && (
        <Popup className="custom-map-popup">
          <div style={{ 
            fontFamily: 'var(--font-body)',
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            padding: '2px',
          }}>
            {children}
          </div>
        </Popup>
      )}
    </Marker>
  );
};
