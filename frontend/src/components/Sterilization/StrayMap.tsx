import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Stray } from '../../services/strayService'

// Fix for default markers
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const createCustomIcon = (isSterilized: boolean) => {
    const color = isSterilized ? '#10b981' : '#ef4444'; // Green : Red
    return L.divIcon({
        className: 'custom-marker',
        html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          color: white;
          font-size: 12px;
          font-weight: bold;
        ">🐾</div>
      </div>
    `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
    })
}

interface StrayMapProps {
    strays: Stray[];
    onStraySelect: (stray: Stray) => void;
}

const StrayMap: React.FC<StrayMapProps> = ({ strays, onStraySelect }) => {
    // Default center coordinates (Mangalore, India)
    const defaultCenter: [number, number] = [12.8855, 74.8388];
    const defaultZoom = 12;

    return (
        <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {strays.map((stray) => (
                    <Marker
                        key={stray._id}
                        position={[stray.location.lat, stray.location.lng]}
                        icon={createCustomIcon(stray.isSterilized)}
                        eventHandlers={{
                            click: () => onStraySelect(stray),
                        }}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2 text-center">
                                <img
                                    src={stray.imageUrl}
                                    alt="Stray"
                                    className="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
                                />
                                <div className={`font-bold mb-1 ${stray.isSterilized ? 'text-green-600' : 'text-red-600'}`}>
                                    {stray.isSterilized ? 'Sterilized' : 'Not Sterilized'}
                                </div>
                                <button
                                    onClick={() => onStraySelect(stray)}
                                    className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700"
                                >
                                    Take Survey
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}

export default StrayMap
