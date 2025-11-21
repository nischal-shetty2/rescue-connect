import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet'
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

// Create custom marker icon for animals
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

// Create custom marker icon for user location
const createUserIcon = () => {
  return L.divIcon({
    className: 'user-marker',
    html: `
      <div style="
        background-color: #ef4444;
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
        ">📍</div>
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
  userLocation?: { lat: number; lng: number } | null
  radius?: string
}

// Helper component to handle flyTo functionality
const MapController: React.FC<{
  selectedAnimal?: string | null
  locations: LocationData[]
  userLocation?: { lat: number; lng: number } | null
}> = ({ selectedAnimal, locations, userLocation }) => {
  const map = useMap()

  useEffect(() => {
    if (selectedAnimal) {
      const selectedLocation = locations.find(loc => loc.id === selectedAnimal)
      if (selectedLocation) {
        map.flyTo([selectedLocation.latitude, selectedLocation.longitude], 13, {
          duration: 1.5,
        })
      }
    } else if (userLocation) {
      // Center on user location if no animal is selected
      map.flyTo([userLocation.lat, userLocation.lng], 12, {
        duration: 1.5,
      })
    }
  }, [selectedAnimal, locations, userLocation, map])

  return null
}

const AdoptionMap: React.FC<AdoptionMapProps> = ({
  locations,
  selectedAnimal,
  userLocation,
  radius,
}) => {
  const customIcon = createCustomIcon()
  const userIcon = createUserIcon()

  // Default center coordinates (Mangalore, India)
  const defaultCenter: [number, number] = [12.8855, 74.8388]
  const defaultZoom = 12

  // Parse radius
  const radiusInMeters = radius && radius !== 'any' ? parseInt(radius) * 1000 : 0

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

        <MapController
          selectedAnimal={selectedAnimal}
          locations={locations}
          userLocation={userLocation}
        />

        {/* User Location Marker and Radius */}
        {userLocation && (
          <>
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            >
              <Popup className="custom-popup">
                <div className="p-2 text-center">
                  <div className="font-semibold text-gray-800">You are here</div>
                </div>
              </Popup>
            </Marker>
            {radiusInMeters > 0 && (
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={radiusInMeters}
                pathOptions={{
                  color: '#3b82f6',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.1,
                }}
              />
            )}
          </>
        )}

        {/* Animal Markers */}
        {locations.map(location => (
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
