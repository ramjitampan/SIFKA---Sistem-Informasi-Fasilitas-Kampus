import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Building } from '../../hooks/useBuildings';
import { Facility } from '../../hooks/useFacilities';

// Fix for default marker icons in Leaflet with React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface MapViewProps {
    buildings: Building[];
    facilities: Facility[];
    center?: [number, number];
    zoom?: number;
}

const MapView: React.FC<MapViewProps> = ({ 
    buildings, 
    facilities, 
    center = [-0.9482, 100.3606], // Default to some coordinates
    zoom = 15 
}) => {
    return (
        <div className="z-0 h-[calc(100vh-160px)] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
            <MapContainer 
                center={center} 
                zoom={zoom} 
                scrollWheelZoom={true}
                className="z-0 h-full w-full"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <ZoomControl position="bottomright" />

                {/* Building Markers */}
                {buildings.map((building) => (
                    <Marker 
                        key={`building-${building.id}`} 
                        position={[building.coordinate.lat, building.coordinate.lng]}
                    >
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold text-slate-900">{building.name}</h3>
                                <p className="text-sm text-slate-600">{building.description}</p>
                                <span className="inline-block mt-2 px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded">
                                    Building
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Facility Markers */}
                {facilities.map((facility) => (
                    <Marker 
                        key={`facility-${facility.id}`} 
                        position={[facility.coordinate.lat, facility.coordinate.lng]}
                    >
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold text-slate-900">{facility.name}</h3>
                                <p className="text-sm text-slate-600">{facility.description}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded">
                                        Facility
                                    </span>
                                    {facility.category && (
                                        <span 
                                            className="px-2 py-0.5 text-xs font-semibold rounded"
                                            style={{ 
                                                backgroundColor: `${facility.category.color_code}20`,
                                                color: facility.category.color_code 
                                            }}
                                        >
                                            {facility.category.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapView;
