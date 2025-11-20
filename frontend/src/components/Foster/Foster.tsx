import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
    MapPin,
    Phone,
    Mail,
    Calendar,
    Award,
    Plus,
    X,
    Crosshair,
} from 'lucide-react'
import { createFoster, getFosters, type FosterProfile } from '../../services/fosterService'

// Fix for default markers
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const Foster = () => {
    const [fosters, setFosters] = useState<FosterProfile[]>([])
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        lat: 0,
        lng: 0,
        animalTypes: [] as string[],
        duration: '',
        experience: '',
    })
    const [isDetectingLocation, setIsDetectingLocation] = useState(false)

    useEffect(() => {
        fetchFosters()
    }, [])

    const fetchFosters = async () => {
        try {
            setLoading(true)
            const data = await getFosters()
            setFosters(data)
        } catch (error) {
            console.error('Error fetching fosters:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAutoDetectLocation = () => {
        setIsDetectingLocation(true)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords

                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                        )
                        const data = await response.json()
                        setFormData(prev => ({
                            ...prev,
                            lat: latitude,
                            lng: longitude,
                            address: data.display_name || `${latitude}, ${longitude}`
                        }))
                    } catch (error) {
                        console.error('Reverse geocoding failed:', error)
                        setFormData(prev => ({
                            ...prev,
                            lat: latitude,
                            lng: longitude,
                            address: `${latitude}, ${longitude}`
                        }))
                    } finally {
                        setIsDetectingLocation(false)
                    }
                },
                (error) => {
                    console.error('Error getting location:', error)
                    setIsDetectingLocation(false)
                    alert('Could not detect location. Please enter manually.')
                }
            )
        } else {
            setIsDetectingLocation(false)
            alert('Geolocation is not supported by this browser.')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createFoster({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                location: {
                    address: formData.address,
                    lat: formData.lat,
                    lng: formData.lng,
                },
                animalTypes: formData.animalTypes,
                duration: formData.duration,
                experience: formData.experience,
            })
            alert('Successfully registered as a foster!')
            setShowModal(false)
            fetchFosters()
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                lat: 0,
                lng: 0,
                animalTypes: [],
                duration: '',
                experience: '',
            })
        } catch (error) {
            console.error('Error creating foster profile:', error)
            alert('Failed to register. Please try again.')
        }
    }

    const toggleAnimalType = (type: string) => {
        setFormData(prev => ({
            ...prev,
            animalTypes: prev.animalTypes.includes(type)
                ? prev.animalTypes.filter(t => t !== type)
                : [...prev.animalTypes, type]
        }))
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Foster Network</h1>
                            <p className="mt-2 text-gray-600">Connect with compassionate people ready to open their homes</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                        >
                            <Plus className="w-5 h-5" />
                            Become a Foster
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* View Toggle */}
                <div className="flex justify-end mb-6">
                    <div className="bg-white p-1 rounded-lg border border-gray-200 flex gap-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            List View
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Map View
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : viewMode === 'list' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {fosters.map((foster) => (
                            <div key={foster._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{foster.name}</h3>
                                            <div className="flex items-center text-gray-500 text-sm mt-1">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                <span className="truncate max-w-[200px]">{foster.location.address}</span>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${foster.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {foster.status || 'Available'}
                                        </span>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex flex-wrap gap-2">
                                            {foster.animalTypes.map(type => (
                                                <span key={type} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium">
                                                    {type}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center text-gray-600 text-sm">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            Available for: {foster.duration}
                                        </div>

                                        <div className="flex items-center text-gray-600 text-sm">
                                            <Award className="w-4 h-4 mr-2 text-gray-400" />
                                            Exp: {foster.experience}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                                        <a href={`tel:${foster.phone}`} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium">
                                            <Phone className="w-4 h-4" />
                                            Call
                                        </a>
                                        <a href={`mailto:${foster.email}`} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-sm font-medium">
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-[600px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                        <MapContainer
                            center={[20.5937, 78.9629]}
                            zoom={5}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {fosters.map((foster) => (
                                <Marker
                                    key={foster._id}
                                    position={[foster.location.lat, foster.location.lng]}
                                >
                                    <Popup>
                                        <div className="p-2">
                                            <h3 className="font-bold text-lg">{foster.name}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{foster.location.address}</p>
                                            <div className="flex gap-1 flex-wrap mb-2">
                                                {foster.animalTypes.map(type => (
                                                    <span key={type} className="text-xs bg-indigo-50 text-indigo-700 px-1 rounded">
                                                        {type}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-500">Duration: {foster.duration}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                )}
            </div>

            {/* Registration Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-bold text-gray-900">Become a Foster Parent</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Enter your address"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAutoDetectLocation}
                                        disabled={isDetectingLocation}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <Crosshair className="w-4 h-4" />
                                        {isDetectingLocation ? 'Detecting...' : 'Auto-detect'}
                                    </button>
                                </div>
                                {formData.lat !== 0 && (
                                    <p className="mt-1 text-xs text-green-600">
                                        Coordinates: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Animals you can foster</label>
                                <div className="flex flex-wrap gap-3">
                                    {['Dog', 'Cat', 'Bird', 'Small Pets', 'Farm Animals'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => toggleAnimalType(type)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.animalTypes.includes(type)
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability Duration</label>
                                    <select
                                        required
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        <option value="">Select duration</option>
                                        <option value="Emergency (1-3 days)">Emergency (1-3 days)</option>
                                        <option value="Short term (1-2 weeks)">Short term (1-2 weeks)</option>
                                        <option value="Medium term (1-2 months)">Medium term (1-2 months)</option>
                                        <option value="Long term (2+ months)">Long term (2+ months)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                                    <select
                                        required
                                        value={formData.experience}
                                        onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        <option value="">Select experience</option>
                                        <option value="First time">First time</option>
                                        <option value="Some experience">Some experience</option>
                                        <option value="Experienced">Experienced</option>
                                        <option value="Professional/Vet">Professional/Vet</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md"
                                >
                                    Register as Foster
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Foster
