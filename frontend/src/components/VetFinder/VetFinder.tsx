import { useState } from 'react'
import { getNearbyVets, getCurrentLocation } from '../../services/vetService'
import type { Vet } from '../../services/vetService'

const VetFinder = () => {
  const [vets, setVets] = useState<Vet[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [maxDistance, setMaxDistance] = useState(10000) // 10km default

  const handleGetLocation = async () => {
    setLoading(true)
    setError(null)

    try {
      const position = await getCurrentLocation()
      const { latitude, longitude } = position.coords

      setUserLocation({ latitude, longitude })

      // Fetch nearby vets
      const nearbyVets = await getNearbyVets(latitude, longitude, maxDistance)
      setVets(nearbyVets)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to get location or fetch vets')
      }
    } finally {
      setLoading(false)
    }
  }

  const getDayName = () => {
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ]
    return days[new Date().getDay()]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏥 Find Veterinarians Near You
          </h1>
          <p className="text-lg text-gray-600">
            Locate the closest veterinary clinics and hospitals for your pet's
            care
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex items-center gap-2">
              <label htmlFor="distance" className="text-gray-700 font-medium">
                Max Distance:
              </label>
              <select
                id="distance"
                value={maxDistance}
                onChange={e => setMaxDistance(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5000}>5 km</option>
                <option value={10000}>10 km</option>
                <option value={20000}>20 km</option>
                <option value={50000}>50 km</option>
              </select>
            </div>

            <button
              onClick={handleGetLocation}
              disabled={loading}
              className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>📍</span>
              {loading ? 'Finding Vets...' : 'Find Nearby Vets'}
            </button>
          </div>

          {userLocation && (
            <div className="mt-4 text-center text-sm text-gray-600">
              📍 Your location: {userLocation.latitude.toFixed(4)},{' '}
              {userLocation.longitude.toFixed(4)}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
            <p className="text-sm mt-2">
              💡 Tip: Make sure to allow location access in your browser
            </p>
          </div>
        )}

        {/* Results */}
        {vets.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Found {vets.length} {vets.length === 1 ? 'Vet' : 'Vets'} Nearby
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vets.map(vet => (
                <div
                  key={vet._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
                >
                  {/* Header */}
                  <div className="border-b pb-4 mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {vet.name}
                    </h3>
                    {vet.distanceInKm !== undefined && (
                      <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        📍 {vet.distanceInKm} km away
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < Math.floor(vet.rating)
                              ? 'text-yellow-500'
                              : 'text-gray-300'
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">
                      {vet.rating.toFixed(1)}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="space-y-2 mb-4 text-sm">
                    <p className="text-gray-700">
                      <span className="font-medium">📍 Address:</span>{' '}
                      {vet.address}
                    </p>
                    <p className="text-gray-600">
                      {vet.city}, {vet.state} {vet.zipCode}
                    </p>
                  </div>

                  {/* Contact */}
                  <div className="space-y-2 mb-4 text-sm">
                    <p className="text-gray-700">
                      <span className="font-medium">📞 Phone:</span>{' '}
                      <a
                        href={`tel:${vet.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {vet.phone}
                      </a>
                    </p>
                    {vet.email && (
                      <p className="text-gray-700">
                        <span className="font-medium">📧 Email:</span>{' '}
                        <a
                          href={`mailto:${vet.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {vet.email}
                        </a>
                      </p>
                    )}
                  </div>

                  {/* Emergency Service */}
                  {vet.emergencyService && (
                    <div className="mb-4">
                      <span className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                        🚨 24/7 Emergency
                      </span>
                    </div>
                  )}

                  {/* Today's Hours */}
                  {vet.openingHours[
                    getDayName() as keyof typeof vet.openingHours
                  ] && (
                    <div className="mb-4 text-sm">
                      <p className="text-gray-700">
                        <span className="font-medium">🕐 Today:</span>{' '}
                        {
                          vet.openingHours[
                            getDayName() as keyof typeof vet.openingHours
                          ]
                        }
                      </p>
                    </div>
                  )}

                  {/* Specialties */}
                  {vet.specialties.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Specialties:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {vet.specialties.slice(0, 3).map((specialty, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {vet.description && (
                    <p className="text-gray-600 text-sm mb-4 italic">
                      "{vet.description}"
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    {vet.website && (
                      <a
                        href={vet.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
                      >
                        Visit Website
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${vet.location.coordinates[1]},${vet.location.coordinates[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center text-sm font-medium"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && vets.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Results Yet
            </h3>
            <p className="text-gray-600">
              Click "Find Nearby Vets" to discover veterinary clinics near you
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VetFinder
