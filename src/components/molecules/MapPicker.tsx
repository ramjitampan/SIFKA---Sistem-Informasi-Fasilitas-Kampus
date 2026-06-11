import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface MapPickerProps {
    onChange: (coords: { lat: number, lng: number }) => void;
    initialLocation?: [number, number] | { lat: number, lng: number };
}

const LocationMarker = ({ position, setPosition, onChange }: { 
    position: [number, number] | null, 
    setPosition: (p: [number, number]) => void,
    onChange: (coords: { lat: number, lng: number }) => void
}) => {
    useMapEvents({
        click(e) {
            const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
            setPosition(newPos);
            onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });

    return position === null ? null : (
        <Marker position={position} />
    );
};

const MapPicker: React.FC<MapPickerProps> = ({ onChange, initialLocation = [-0.9482, 100.3606] }) => {
    const parsedInitialLocation: [number, number] = Array.isArray(initialLocation) 
        ? initialLocation 
        : [initialLocation.lat, initialLocation.lng];
        
    const [position, setPosition] = useState<[number, number] | null>(parsedInitialLocation);

    return (
        <div className="h-full w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
            <MapContainer
                center={parsedInitialLocation}
                zoom={16}
                className="h-full w-full z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker 
                    position={position} 
                    setPosition={setPosition} 
                    onChange={onChange} 
                />
            </MapContainer>
        </div>
    );
};

export default MapPicker;
