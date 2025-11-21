import { X, Upload, MapPin, Crosshair } from 'lucide-react'
import { useState, useEffect, useRef, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  createAdoption,
  type AdoptionPost,
} from '../../services/adoptionService'

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

interface LocationData {
  lat: number
  lng: number
  address?: string
}

interface PostModalProps {
  setShowPostModal: (value: boolean) => void
}

interface PostData {
  animalType: string
  animalName?: string
  location: LocationData
  age?: string
  gender?: string
  condition: string
  description: string
  images: string[]
  contactNumber: string
  posterName: string
  vaccinated: boolean
  timestamp: string
}

export default function PostModal({ setShowPostModal }: PostModalProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [selectedAnimalType, setSelectedAnimalType] = useState<string>('')
  const [animalName, setAnimalName] = useState<string>('')
  const [posterName, setPosterName] = useState<string>('')
  const [contactNumber, setContactNumber] = useState<string>('')
  const [age, setAge] = useState<string>('')
  const [gender, setGender] = useState<string>('')
  const [condition, setCondition] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [vaccinated, setVaccinated] = useState<boolean>(false)
  const [showMap, setShowMap] = useState<boolean>(false)
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  )
  const [locationInput, setLocationInput] = useState<string>('')
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false)

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  // Default location (Mangalore, India)
  const defaultLocation = useMemo<LocationData>(
    () => ({ lat: 12.8855, lng: 74.8388 }),
    []
  )

  // Initialize map when showMap becomes true
  useEffect(() => {
    if (showMap && mapRef.current && !mapInstanceRef.current) {
      const center = selectedLocation || defaultLocation

      mapInstanceRef.current = L.map(mapRef.current).setView(
        [center.lat, center.lng],
        15
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current)

      // Add click listener - this will update both selectedLocation AND locationInput
      mapInstanceRef.current.on('click', async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng
        const location: LocationData = { lat, lng }

        try {
          const address = await reverseGeocode(lat, lng)
          location.address = address
          setLocationInput(address) // This updates the input box
        } catch (error) {
          console.error(error)
          const fallbackAddress = `Selected: ${lat.toFixed(4)}, ${lng.toFixed(
            4
          )}`
          location.address = fallbackAddress
          setLocationInput(fallbackAddress) // This updates the input box
        }

        setSelectedLocation(location)

        // Remove existing marker
        if (markerRef.current && mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(markerRef.current)
        }

        // Add new marker
        if (mapInstanceRef.current) {
          markerRef.current = L.marker([lat, lng])
            .addTo(mapInstanceRef.current)
            .bindPopup('Selected location')
            .openPopup()
        }
      })

      // Add marker if location is already selected
      if (selectedLocation) {
        markerRef.current = L.marker([
          selectedLocation.lat,
          selectedLocation.lng,
        ])
          .addTo(mapInstanceRef.current)
          .bindPopup('Selected location')
          .openPopup()
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [showMap, defaultLocation, selectedLocation])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages: string[] = []
      let filesProcessed = 0

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target?.result) {
              newImages.push(e.target.result as string)
            }
            filesProcessed++
            if (filesProcessed === files.length) {
              setUploadedImages(prev => [...prev, ...newImages])
            }
          }
          reader.readAsDataURL(file)
        } else {
          filesProcessed++
        }
      }
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
      const data = await response.json()
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    }
  }

  const handleAutoDetectLocation = () => {
    setIsDetectingLocation(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords
          const location: LocationData = { lat: latitude, lng: longitude }

          try {
            const address = await reverseGeocode(latitude, longitude)
            location.address = address
            setLocationInput(address) // Updates input box
          } catch (error) {
            console.error(error)
            const fallbackAddress = `Detected: ${latitude.toFixed(
              4
            )}, ${longitude.toFixed(4)}`
            location.address = fallbackAddress
            setLocationInput(fallbackAddress) // Updates input box
          }

          setSelectedLocation(location)
          setIsDetectingLocation(false)

          // Update map if it's open
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 15)

            // Remove existing marker
            if (markerRef.current) {
              mapInstanceRef.current.removeLayer(markerRef.current)
            }

            // Add new marker
            markerRef.current = L.marker([latitude, longitude])
              .addTo(mapInstanceRef.current)
              .bindPopup('Auto-detected location')
              .openPopup()
          }
        },
        (error: GeolocationPositionError) => {
          console.error('Error getting location:', error)
          setIsDetectingLocation(false)
          alert(
            'Could not detect your location. Please select manually on the map.'
          )
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      )
    } else {
      setIsDetectingLocation(false)
      alert('Geolocation is not supported by this browser.')
    }
  }

  // Remove the separate handleMapClick function since it's now inline in useEffect

  const handleCloseModal = () => {
    setShowPostModal(false)
    setUploadedImages([])
    setSelectedAnimalType('')
    setAnimalName('')
    setPosterName('')
    setContactNumber('')
    setAge('')
    setGender('')
    setCondition('')
    setDescription('')
    setVaccinated(false)
    setSelectedLocation(null)
    setLocationInput('')
    setShowMap(false)
  }

  const validateForm = (): boolean => {
    if (!selectedAnimalType) {
      alert('Please select an animal type.')
      return false
    }

    if (!selectedLocation) {
      alert('Please select a location on the map or auto-detect your location.')
      return false
    }

    if (!condition) {
      alert("Please select the animal's condition.")
      return false
    }

    if (!description.trim()) {
      alert('Please provide a description.')
      return false
    }

    if (!contactNumber.trim()) {
      alert('Please provide your contact number.')
      return false
    }

    if (!posterName.trim()) {
      alert('Please provide your name.')
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    const postData: PostData = {
      animalType: selectedAnimalType,
      animalName: animalName || undefined,
      location: selectedLocation!,
      age: age || undefined,
      gender: gender || undefined,
      condition,
      description,
      images: uploadedImages,
      contactNumber,
      posterName,
      vaccinated,
      timestamp: new Date().toISOString(),
    }

    try {
      // Get user info for API
      const user = JSON.parse(localStorage.getItem('user') || '{}')

      // Prepare data for API
      const mapAnimalType = (
        type: string
      ): 'dog' | 'cat' | 'bird' | 'other' => {
        const lowerType = type.toLowerCase()
        if (lowerType === 'cow') return 'other'
        if (['dog', 'cat', 'bird'].includes(lowerType)) {
          return lowerType as 'dog' | 'cat' | 'bird'
        }
        return 'other'
      }

      const parseAge = (ageString?: string): number => {
        if (!ageString) return 0
        const match = ageString.match(/(\d+)/)
        return match ? parseInt(match[1]) : 0
      }

      const apiData: Omit<AdoptionPost, '_id' | 'postedAt' | 'updatedAt'> = {
        animalName: postData.animalName || 'Unknown',
        animalType: mapAnimalType(postData.animalType),
        breed: 'Mixed', // You can add breed field to your form if needed
        age: parseAge(postData.age),
        gender: (postData.gender?.toLowerCase() === 'female'
          ? 'female'
          : 'male') as 'male' | 'female',
        size: 'medium' as const, // You can add size field to your form if needed
        description: postData.description,
        medicalInfo: postData.condition || 'No medical information provided',
        location:
          postData.location.address ||
          `${postData.location.lat}, ${postData.location.lng}`,
        coordinates: {
          lat: postData.location.lat,
          lng: postData.location.lng,
        },
        contactInfo: {
          name: postData.posterName,
          phone: postData.contactNumber,
          email: user.email || 'no-email@example.com',
        },
        images: postData.images,
        status: 'available' as const,
        postedBy: user.email || 'anonymous',
      }

      // Save to API
      try {
        await createAdoption(apiData)
        console.log('Post saved to database successfully')
        alert('Post created successfully and saved to database!')
        handleCloseModal()
      } catch (apiError) {
        console.error('Failed to save adoption post:', apiError)
        alert('Error saving post to database. Please try again.')
      }
    } catch (error) {
      console.error('Error preparing post:', error)
      alert('Error saving post. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Post a Stray Animal
          </h2>
          <button
            onClick={handleCloseModal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Animal Type Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Animal Type *
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['Dog', 'Cat', 'Cow'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedAnimalType(type)}
                  className={`p-4 border-2 rounded-2xl transition-all text-center font-medium ${selectedAnimalType === type
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                >
                  {type === 'Dog' && '🐕'}
                  {type === 'Cat' && '🐱'}
                  {type === 'Cow' && '🐄'}
                  <div className="mt-2">{type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Animal Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Animal Name (Optional)
            </label>
            <input
              type="text"
              value={animalName}
              onChange={e => setAnimalName(e.target.value)}
              placeholder="e.g., Buddy, Luna..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Location Section */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Location Where Found *
            </label>

            {/* Location Input and Controls */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={locationInput}
                  onChange={e => setLocationInput(e.target.value)}
                  placeholder="Auto-detect or select location on map..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={handleAutoDetectLocation}
                  disabled={isDetectingLocation}
                  className="px-4 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center gap-2"
                >
                  <Crosshair className="w-5 h-5" />
                  {isDetectingLocation ? 'Detecting...' : 'Auto-detect'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className="px-4 py-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  {showMap ? 'Hide Map' : 'Select on Map'}
                </button>
              </div>

              {selectedLocation && (
                <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-xl">
                  ✓ Location selected: {selectedLocation.lat.toFixed(4)},{' '}
                  {selectedLocation.lng.toFixed(4)}
                </div>
              )}
            </div>

            {/* Map Container */}
            {showMap && (
              <div className="mt-4">
                <div
                  ref={mapRef}
                  style={{ height: '300px', width: '100%' }}
                  className="rounded-xl border-2 border-gray-200"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Click on the map to select the exact location where the animal
                  was found
                </p>
              </div>
            )}
          </div>

          {/* Animal Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Age (Estimated)
              </label>
              <select
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="">Select age</option>
                <option value="Young (0-1 year)">Young (0-1 year)</option>
                <option value="Adult (1-7 years)">Adult (1-7 years)</option>
                <option value="Senior (7+ years)">Senior (7+ years)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Gender (Optional)
              </label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="">Select if known</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Condition *
            </label>
            <select
              value={condition}
              onChange={e => setCondition(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors"
              required
            >
              <option value="">Select condition</option>
              <option value="Good">Good</option>
              <option value="Injured">Injured</option>
              <option value="Sick">Sick</option>
              <option value="Pregnant">Pregnant</option>
              <option value="Malnourished">Malnourished</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the animal's condition, behaviorand any immediate needs..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Upload Photos
            </label>

            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer"
              onClick={() => document.getElementById('imageUpload')?.click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Click to upload photos</p>
              <p className="text-sm text-gray-500">
                Supports JPG, PNG up to 10MB each
              </p>
            </div>

            {/* Hidden File Input */}
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Preview Uploaded Images */}
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Uploaded Photos ({uploadedImages.length})
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Your Contact Number *
            </label>
            <input
              type="tel"
              value={contactNumber}
              onChange={e => setContactNumber(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Poster Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Priya Singh"
              value={posterName}
              onChange={e => setPosterName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be shown as "Posted by [Your Name]" on the listing
            </p>
          </div>

          {/* Vaccination Status */}
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={vaccinated}
                onChange={e => setVaccinated(e.target.checked)}
                className="w-5 h-5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Animal appears to be vaccinated (if known)
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
            >
              Post Animal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
