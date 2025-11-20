import { useState } from 'react'
import { getNearbyBoardings, getCurrentLocation } from '../../services/boardingService'
import type { Boarding } from '../../services/boardingService'

const BoardingFinder = () => {
    const [boardings, setBoardings] = useState<Boarding[]>([])
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

            // Fetch nearby boardings
            const nearbyBoardings = await getNearbyBoardings(latitude, longitude, maxDistance)
            setBoardings(nearbyBoardings)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Failed to get location or fetch boardings')
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
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        🏠 Find Pet Boarding Near You
                    </h1>
                    <p className="text-lg text-gray-600">
                        Locate the closest pet boarding and daycare facilities for your furry friends
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
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                            className={`px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            <span>📍</span>
                            {loading ? 'Finding Places...' : 'Find Nearby Boarding'}
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
                {boardings.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Found {boardings.length} {boardings.length === 1 ? 'Place' : 'Places'} Nearby
                        </h2>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {boardings.map(boarding => (
                                <div
                                    key={boarding._id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
                                >
                                    {/* Header */}
                                    <div className="border-b pb-4 mb-4">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            {boarding.name}
                                        </h3>
                                        {boarding.distanceInKm !== undefined && (
                                            <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                📍 {boarding.distanceInKm} km away
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
                                                        i < Math.floor(boarding.rating)
                                                            ? 'text-yellow-500'
                                                            : 'text-gray-300'
                                                    }
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-gray-600 text-sm">
                                            {boarding.rating.toFixed(1)}
                                        </span>
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-2 mb-4 text-sm">
                                        <p className="text-gray-700">
                                            <span className="font-medium">📍 Address:</span>{' '}
                                            {boarding.address}
                                        </p>
                                        <p className="text-gray-600">
                                            {boarding.city}, {boarding.state} {boarding.zipCode}
                                        </p>
                                    </div>

                                    {/* Contact */}
                                    <div className="space-y-2 mb-4 text-sm">
                                        <p className="text-gray-700">
                                            <span className="font-medium">📞 Phone:</span>{' '}
                                            <a
                                                href={`tel:${boarding.phone}`}
                                                className="text-green-600 hover:underline"
                                            >
                                                {boarding.phone}
                                            </a>
                                        </p>
                                        {boarding.email && (
                                            <p className="text-gray-700">
                                                <span className="font-medium">📧 Email:</span>{' '}
                                                <a
                                                    href={`mailto:${boarding.email}`}
                                                    className="text-green-600 hover:underline"
                                                >
                                                    {boarding.email}
                                                </a>
                                            </p>
                                        )}
                                    </div>

                                    {/* Emergency Service */}
                                    {boarding.emergencyService && (
                                        <div className="mb-4">
                                            <span className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                                🚨 24/7 Emergency
                                            </span>
                                        </div>
                                    )}

                                    {/* Today's Hours */}
                                    {boarding.openingHours[
                                        getDayName() as keyof typeof boarding.openingHours
                                    ] && (
                                            <div className="mb-4 text-sm">
                                                <p className="text-gray-700">
                                                    <span className="font-medium">🕐 Today:</span>{' '}
                                                    {
                                                        boarding.openingHours[
                                                        getDayName() as keyof typeof boarding.openingHours
                                                        ]
                                                    }
                                                </p>
                                            </div>
                                        )}

                                    {/* Specialties */}
                                    {boarding.specialties.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-gray-700 mb-2">
                                                Services:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {boarding.specialties.slice(0, 3).map((specialty, idx) => (
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
                                    {boarding.description && (
                                        <p className="text-gray-600 text-sm mb-4 italic">
                                            "{boarding.description}"
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-4">
                                        {boarding.website && (
                                            <a
                                                href={boarding.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center text-sm font-medium"
                                            >
                                                Visit Website
                                            </a>
                                        )}
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${boarding.location.coordinates[1]},${boarding.location.coordinates[0]}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
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
                {!loading && boardings.length === 0 && !error && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🏠</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No Results Yet
                        </h3>
                        <p className="text-gray-600">
                            Click "Find Nearby Boarding" to discover pet boarding near you
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BoardingFinder
