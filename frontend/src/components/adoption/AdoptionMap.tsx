import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Create custom marker icon
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: #3b82f6;
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

interface LocationData {
  id: string
  name: string
  latitude: number
  longitude: number
}

interface AdoptionMapProps {
  locations: LocationData[]
  selectedAnimal?: string | null
}

// Helper component to handle flyTo functionality
const FlyToSelected: React.FC<{ selectedAnimal?: string | null; locations: LocationData[] }> = ({ 
  selectedAnimal, 
  locations 
}) => {
  const map = useMap()

  useEffect(() => {
    if (selectedAnimal) {
      const selectedLocation = locations.find(loc => loc.id === selectedAnimal)
      if (selectedLocation) {
        map.flyTo([selectedLocation.latitude, selectedLocation.longitude], 13, { 
          duration: 1.5 
        })
      }
    }
  }, [selectedAnimal, locations, map])

  return null
}

const AdoptionMap: React.FC<AdoptionMapProps> = ({ locations, selectedAnimal }) => {
  const customIcon = createCustomIcon()

  // Default center coordinates (India)
  const defaultCenter: [number, number] = [20.5937, 78.9629]
  const defaultZoom = 5

  return (
    <div className="w-full h-full">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FlyToSelected selectedAnimal={selectedAnimal} locations={locations} />
        
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={customIcon}
          >
            <Popup className="custom-popup">
              <div className="p-2 text-center">
                <div className="font-semibold text-gray-800 mb-1">
                  🐾 {location.name}
                </div>
                <div className="text-sm text-gray-600">
                  Available for adoption
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default AdoptionMap
