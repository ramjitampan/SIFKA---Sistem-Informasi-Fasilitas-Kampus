import React from 'react';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';

const createClusterCustomIcon = (cluster) => {
  const count = cluster.getChildCount();
  let size = 40;
  let color = 'var(--accent)';
  
  if (count > 10) size = 50;
  if (count > 50) size = 60;

  return L.divIcon({
    html: `<div style="
      width: ${size}px; height: ${size}px; 
      background: var(--bg-surface); 
      border: 2px solid ${color}; 
      border-radius: 50%; 
      display: flex; align-items: center; justify-content: center; 
      color: ${color}; font-weight: 800; font-family: var(--font-display);
      box-shadow: 0 0 20px var(--accent-glow);
      backdrop-filter: blur(8px);
    ">
      <span>${count}</span>
    </div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(size, size, true),
  });
};

export const MapClusterLayer = ({ children }) => {
  return (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={createClusterCustomIcon}
      showCoverageOnHover={false}
      spiderfyOnMaxZoom={true}
    >
      {children}
    </MarkerClusterGroup>
  );
};
