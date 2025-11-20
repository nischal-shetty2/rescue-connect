import { useState, useEffect } from 'react'
import {
  MapPin,
  Clock,
  Heart,
  Filter,
  Grid,
  List,
  Camera,
  AlertCircle,
  Star,
  Phone,
  Plus,
  X,
} from 'lucide-react'
import PostModal from './PostModal'
import {
  getAdoptions,
  deleteAdoption,
  type AdoptionPost,
} from '../../services/adoptionService'
import AdoptionMap from '../adoption/AdoptionMap'

const dummyAnimals = [
  {
    id: 1,
    type: 'Dog',
    name: 'Buddy',
    image:
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
    location: 'MG Road, Bengaluru',
    distance: '2.1 km',
    info: 'Healthy, friendly, needs shelter. Vaccinated.',
    age: '2 years',
    gender: 'Male',
    rescuer: 'Sarah Kumar',
    postedTime: '2 hours ago',
    condition: 'Good',
    vaccinated: true,
    contact: '+91 98765 43210',
    isUserCreated: false,
  },
  {
    id: 2,
    type: 'Cow',
    name: 'Gauri',
    image:
      'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?q=80&w=788&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    location: 'Indiranagar, Bengaluru',
    distance: '3.5 km',
    info: 'Injured leg, needs medical attention. Docile.',
    age: 'Adult',
    gender: 'Female',
    rescuer: 'Ramesh Patel',
    postedTime: '30 minutes ago',
    condition: 'Injured',
    vaccinated: false,
    contact: '+91 87654 32109',
    isUserCreated: false,
  },
  {
    id: 3,
    type: 'Cat',
    name: 'Whiskers',
    image:
      'https://plus.unsplash.com/premium_photo-1667030474693-6d0632f97029?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    location: 'Koramangala, Bengaluru',
    distance: '1.2 km',
    info: 'Young, scared, needs food and care.',
    age: '6 months',
    gender: 'Female',
    rescuer: 'Priya Singh',
    postedTime: '1 hour ago',
    condition: 'Fair',
    vaccinated: true,
    contact: '+91 76543 21098',
    isUserCreated: false,
  },
  {
    id: 4,
    type: 'Dog',
    name: 'Rocky',
    image:
      'https://plus.unsplash.com/premium_photo-1667099521469-df09eb52c812?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    location: 'Whitefield, Bengaluru',
    distance: '5.8 km',
    info: 'Abandoned puppy, very playful and energetic.',
    age: '4 months',
    gender: 'Male',
    rescuer: 'John Matthew',
    postedTime: '4 hours ago',
    condition: 'Good',
    vaccinated: false,
    contact: '+91 65432 10987',
    isUserCreated: false,
  },
  {
    id: 5,
    type: 'Cat',
    name: 'Luna',
    image:
      'https://images.unsplash.com/photo-1570018143038-6f4c428f6e3e?q=80&w=761&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    location: 'HSR Layout, Bengaluru',
    distance: '4.2 km',
    info: 'Pregnant cat, needs immediate shelter and care.',
    age: '1.5 years',
    gender: 'Female',
    rescuer: 'Anjali Mehta',
    postedTime: '15 minutes ago',
    condition: 'Pregnant',
    vaccinated: true,
    contact: '+91 54321 09876',
    isUserCreated: false,
  },
]

const StartRescuingPage = () => {
  const [viewMode, setViewMode] = useState('grid')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)
  type AnimalPost = {
    id: string | number
    animalType?: string
    animalName?: string
    images?: string[]
    location?: { address?: string }
    description?: string
    age?: string
    gender?: string
    posterName?: string
    timestamp?: string
    condition?: string
    vaccinated?: boolean
    contactNumber?: string
  }
  type Animal = {
    id: number
    type: string
    name: string
    image: string
    location: string
    distance: string
    info: string
    age: string
    gender: string
    rescuer: string
    postedTime: string
    condition: string
    vaccinated: boolean
    contact: string
    isUserCreated?: boolean
  }

  const [storedPosts, setStoredPosts] = useState<AnimalPost[]>([])
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)
  const [showAdoptionModal, setShowAdoptionModal] = useState(false)
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null)
  const [layoutMode, setLayoutMode] = useState<'listings' | 'map'>('listings')

  // New API-related state
  const [apiAnimals, setApiAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [adoptionForm, setAdoptionForm] = useState({
    adopterName: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    housing: '',
    reason: '',
    availability: '',
  })

  // Fetch animals from API
  const fetchAnimalsFromAPI = async () => {
    try {
      setLoading(true)
      setError(null)

      const apiData = await getAdoptions({
        type: selectedFilter === 'all' ? undefined : selectedFilter,
      })

      // Convert API data to Animal format
      const convertedAnimals = apiData.map((post: AdoptionPost) => ({
        id: post._id || Date.now(),
        type:
          post.animalType.charAt(0).toUpperCase() + post.animalType.slice(1),
        name: post.animalName,
        image:
          post.images?.[0] ||
          'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
        location: post.location,
        distance: '0 km away',
        info: post.description,
        age: post.age.toString(),
        gender: post.gender.charAt(0).toUpperCase() + post.gender.slice(1),
        rescuer: post.contactInfo.name,
        postedTime: getTimeAgo(post.postedAt),
        condition: 'good', // You can map this from your API data
        vaccinated: true, // You can map this from your API data
        contact: post.contactInfo.phone,
        isUserCreated: true,
      }))

      setApiAnimals(convertedAnimals)
    } catch (err) {
      console.error('Error fetching from API:', err)
      setError('Failed to load from database')
      setApiAnimals([])
    } finally {
      setLoading(false)
    }
  }

  // Load posts from localStorage on component mount
  useEffect(() => {
    const loadStoredPosts = () => {
      try {
        const posts = JSON.parse(localStorage.getItem('animalPosts') || '[]')
        setStoredPosts(posts)
      } catch (error) {
        console.error('Error loading posts from localStorage:', error)
        setStoredPosts([])
      }
    }

    loadStoredPosts()

    // Listen for storage changes and custom events
    const handleStorageChange = () => {
      loadStoredPosts()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('postAdded', handleStorageChange)
    window.addEventListener('postDeleted', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('postAdded', handleStorageChange)
      window.removeEventListener('postDeleted', handleStorageChange)
    }
  }, [])

  // Fetch animals from API when filter changes
  useEffect(() => {
    fetchAnimalsFromAPI()
  }, [selectedFilter])

  const handleDeletePost = async (postId: string | number) => {
    console.log('=== DELETE POST FUNCTION CALLED ===')
    console.log('Post ID to delete:', postId, 'Type:', typeof postId)

    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        // If it's a string ID, it's from the API
        if (typeof postId === 'string') {
          await deleteAdoption(postId)
          alert('Post deleted successfully!')
          fetchAnimalsFromAPI() // Refresh API data
        } else {
          // Handle localStorage deletion (for backward compatibility)
          const existingPosts = JSON.parse(
            localStorage.getItem('animalPosts') || '[]'
          )

          console.log('All existing posts:', existingPosts)

          // Find the post to delete
          const postToDelete = existingPosts.find(
            (post: AnimalPost) =>
              String(post.id) === String(postId) ||
              Number(post.id) === Number(postId)
          )

          console.log('Post found for deletion:', postToDelete)

          if (!postToDelete) {
            alert(`Post with ID ${postId} not found in localStorage!`)
            return
          }

          const updatedPosts = existingPosts.filter(
            (post: AnimalPost) =>
              String(post.id) !== String(postId) &&
              Number(post.id) !== Number(postId)
          )

          console.log('Posts after deletion:', updatedPosts)
          console.log(
            'Number of posts removed:',
            existingPosts.length - updatedPosts.length
          )

          localStorage.setItem('animalPosts', JSON.stringify(updatedPosts))
          setStoredPosts(updatedPosts)
          window.dispatchEvent(new CustomEvent('postDeleted'))

          alert('Post deleted successfully!')
        }
      } catch (error) {
        console.error('Error deleting post:', error)
        alert('Error deleting post. Please try again.')
      }
    }
  }

  // Convert stored posts to the format expected by the UI
  const convertStoredPostsToAnimals = (posts: AnimalPost[]): Animal[] => {
    console.log('Converting stored posts to animals:', posts)
    const converted = posts.map(post => {
      const animal = {
        id: post.id
          ? typeof post.id === 'string'
            ? parseInt(post.id)
            : post.id
          : Date.now(),
        type: post.animalType || 'Unknown',
        name: post.animalName || 'Unknown',
        image:
          post.images && post.images.length > 0
            ? post.images[0]
            : 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
        location: post.location?.address || 'Unknown Location',
        distance: '0 km away',
        info: post.description || 'No description available',
        age: post.age || 'Unknown',
        gender: post.gender || 'Unknown',
        rescuer: post.posterName || 'Anonymous',
        postedTime: getTimeAgo(post.timestamp),
        condition: post.condition || 'Unknown',
        vaccinated: post.vaccinated || false,
        contact: post.contactNumber || 'No contact',
        isUserCreated: true,
      }
      console.log(`Converted post ${post.id} to animal:`, animal)
      return animal
    })
    console.log('All converted animals:', converted)
    return converted
  }

  // Helper function to calculate time ago
  const getTimeAgo = (timestamp?: string): string => {
    if (!timestamp) return 'Recently'

    const now = new Date()
    const posted = new Date(timestamp)
    const diffInMinutes = Math.floor(
      (now.getTime() - posted.getTime()) / (1000 * 60)
    )

    if (diffInMinutes < 1) {
      return 'Just now'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} day${days > 1 ? 's' : ''} ago`
    }
  }

  // Generate map locations from animal data
  const generateMapLocations = (animals: Animal[]) => {
    // Base coordinates for different Indian cities for demonstration
    const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
      'MG Road, Bengaluru': { lat: 12.9716, lng: 77.5946 },
      'Indiranagar, Bengaluru': { lat: 12.9719, lng: 77.6412 },
      'Koramangala, Bengaluru': { lat: 12.9352, lng: 77.6245 },
      'Whitefield, Bengaluru': { lat: 12.9698, lng: 77.7500 },
      'HSR Layout, Bengaluru': { lat: 12.9082, lng: 77.6476 },
      'Delhi': { lat: 28.6139, lng: 77.2090 },
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Chennai': { lat: 13.0827, lng: 80.2707 },
      'Kolkata': { lat: 22.5726, lng: 88.3639 },
      'Hyderabad': { lat: 17.3850, lng: 78.4867 },
    }

    return animals.map((animal) => {
      // Try to match location with known coordinates
      let coordinates = cityCoordinates[animal.location]
      
      // If no exact match, try partial matching
      if (!coordinates) {
        const locationKey = Object.keys(cityCoordinates).find(key => 
          animal.location.toLowerCase().includes(key.toLowerCase()) ||
          key.toLowerCase().includes(animal.location.toLowerCase())
        )
        if (locationKey) {
          coordinates = cityCoordinates[locationKey]
        }
      }

      // If still no match, generate random coordinates around Bengaluru
      if (!coordinates) {
        coordinates = {
          lat: 12.9716 + (Math.random() - 0.5) * 0.1, // Random offset around Bengaluru
          lng: 77.5946 + (Math.random() - 0.5) * 0.1
        }
      }

      return {
        id: String(animal.id),
        name: animal.name,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      }
    })
  }

  // Adoption handlers
  const handleRescueClick = (animal: Animal) => {
    console.log('Rescue button clicked for animal:', animal.name)
    setSelectedAnimal(animal)
    setSelectedAnimalId(String(animal.id)) // Set selected animal for map flyTo
    setShowAdoptionModal(true)
    console.log('Modal should be shown now')
  }

  const handleAdoptionSubmit = () => {
    if (
      !selectedAnimal ||
      !adoptionForm.adopterName ||
      !adoptionForm.email ||
      !adoptionForm.phone
    ) {
      alert('Please fill in all required fields')
      return
    }

    // Create adoption request
    const adoptionRequest = {
      id: Date.now().toString(),
      animalId: selectedAnimal.id,
      animalName: selectedAnimal.name,
      animalType: selectedAnimal.type,
      animalLocation: selectedAnimal.location,
      rescuerName: selectedAnimal.rescuer,
      rescuerContact: selectedAnimal.contact,
      adopterInfo: { ...adoptionForm },
      status: 'pending',
      timestamp: new Date().toISOString(),
    }

    // Save to localStorage
    try {
      const existingRequests = JSON.parse(
        localStorage.getItem('adoptionRequests') || '[]'
      )
      const updatedRequests = [...existingRequests, adoptionRequest]
      localStorage.setItem('adoptionRequests', JSON.stringify(updatedRequests))

      alert(
        `Your adoption request for ${selectedAnimal.name} has been submitted! The rescuer will be notified.`
      )
      setShowAdoptionModal(false)
      setSelectedAnimal(null)
      setAdoptionForm({
        adopterName: '',
        email: '',
        phone: '',
        address: '',
        experience: '',
        housing: '',
        reason: '',
        availability: '',
      })
    } catch (error) {
      console.error('Error saving adoption request:', error)
      alert('Error submitting request. Please try again.')
    }
  }

  const getConditionIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'injured':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'pregnant':
        return <Heart className="w-4 h-4 text-pink-500" />
      default:
        return <Star className="w-4 h-4 text-green-500" />
    }
  }

  // Combine dummy animals with stored posts and API data
  const allAnimals = [
    ...dummyAnimals,
    ...convertStoredPostsToAnimals(storedPosts),
    ...apiAnimals,
  ]

  const filteredAnimals =
    selectedFilter === 'all'
      ? allAnimals
      : allAnimals.filter(
          animal => animal.type.toLowerCase() === selectedFilter
        )

  const handleOpenModal = () => {
    setShowPostModal(true)
  }

  const handleCloseModal = () => {
    setShowPostModal(false)
    // Refresh both stored posts and API data when modal closes
    fetchAnimalsFromAPI()
    const loadStoredPosts = () => {
      try {
        const posts = JSON.parse(localStorage.getItem('animalPosts') || '[]')
        setStoredPosts(posts)
      } catch (error) {
        console.error('Error loading posts from localStorage:', error)
        setStoredPosts([])
      }
    }
    loadStoredPosts()
  }

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredAnimals.map(animal => (
        <div
          key={animal.id}
          className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group border border-gray-100"
        >
          <div className="relative">
            <img
              src={animal.image}
              alt={animal.name}
              className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-sm font-medium">
              <Camera className="w-4 h-4 inline mr-1" />
              {animal.postedTime}
            </div>
            {animal.isUserCreated && (
              <button
                onClick={e => {
                  console.log(
                    `Delete button clicked for ${animal.name} with ID: ${animal.id}, isUserCreated: ${animal.isUserCreated}`
                  )
                  e.preventDefault()
                  e.stopPropagation()
                  handleDeletePost(animal.id)
                }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white p-2 rounded-full z-10 cursor-pointer"
                title="Delete this post"
                style={{ pointerEvents: 'auto' }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {animal.name}
              </h3>
              <span className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-medium">
                {animal.type}
              </span>
            </div>

            <div className="flex items-center text-indigo-600 mb-3">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="font-medium">{animal.location}</span>
            </div>

            <div className="flex items-center text-gray-500 mb-4">
              <span className="text-sm font-medium">
                {animal.distance} away
              </span>
              <span className="mx-3">•</span>
              <div className="flex items-center">
                {getConditionIcon(animal.condition)}
                <span className="text-sm ml-1 font-medium">
                  {animal.condition}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-6 line-clamp-2">
              {animal.info}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
              <span className="font-medium">
                {animal.age} • {animal.gender}
              </span>
              <span className="flex items-center">
                {animal.vaccinated && (
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">
                    Vaccinated
                  </span>
                )}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleRescueClick(animal)}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-2xl text-sm font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group shadow-lg"
              >
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Rescue Now
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-3 rounded-2xl hover:bg-gray-200 transition-colors shadow-sm">
                <Phone className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 pt-4 border-t text-xs text-gray-500">
              Posted by{' '}
              <span className="font-semibold text-gray-700">
                {animal.rescuer}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const ListView = () => (
    <div className="space-y-4">
      {filteredAnimals.map(animal => (
        <div
          key={animal.id}
          className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 group"
        >
          <div className="flex gap-6">
            <div className="relative flex-shrink-0">
              <img
                src={animal.image}
                alt={animal.name}
                className="w-32 h-32 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {animal.name}
                    <span className="text-lg text-gray-500 font-normal ml-2">
                      ({animal.type})
                    </span>
                  </h3>
                  <div className="flex items-center text-blue-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="font-medium">{animal.location}</span>
                    <span className="text-gray-500 ml-3">
                      {animal.distance} away
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {animal.isUserCreated && (
                      <button
                        onClick={e => {
                          console.log(
                            `ListView delete button clicked for ${animal.name} with ID: ${animal.id}, isUserCreated: ${animal.isUserCreated}`
                          )
                          e.preventDefault()
                          e.stopPropagation()
                          handleDeletePost(animal.id)
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-full z-10 cursor-pointer"
                        title="Delete this post"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{animal.postedTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{animal.info}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {getConditionIcon(animal.condition)}
                  <span className="text-sm ml-1 text-gray-700">
                    {animal.condition}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-700">
                  {animal.age}, {animal.gender}
                </span>
                <span className="text-gray-400">•</span>
                {animal.vaccinated && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    Vaccinated
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Posted by{' '}
                  <span className="font-medium text-gray-700">
                    {animal.rescuer}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact
                  </button>
                  <button
                    onClick={() => handleRescueClick(animal)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center group"
                  >
                    <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Rescue Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  // Add loading state
  if (loading && apiAnimals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading animals...</p>
        </div>
      </div>
    )
  }

  // Add error state (optional)
  if (error && apiAnimals.length === 0 && dummyAnimals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchAnimalsFromAPI}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Layout Toggle */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Animal Rescue</h1>
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setLayoutMode('listings')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              layoutMode === 'listings'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4" />
            Listings
          </button>
          <button
            onClick={() => setLayoutMode('map')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              layoutMode === 'map'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Map
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Adoption Listings */}
        {layoutMode === 'listings' && (
          <div className="w-full min-h-screen p-6 bg-gradient-to-b from-white to-blue-50">
            <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-6 mb-6">
            <h1 className="text-5xl font-bold text-gray-900">
              Animals Nearby Need Your
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {' '}
                Help
              </span>
            </h1>
            <button
              onClick={handleOpenModal}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Post Animal
            </button>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with stray animals in your area and make a difference in
            their lives
          </p>
        </div>

        {/* Filters and View Toggle */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 mb-12 border border-white/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-2xl transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 shadow-lg"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>

              <select
                value={selectedFilter}
                onChange={e => setSelectedFilter(e.target.value)}
                className="border-2 border-indigo-200 rounded-2xl px-6 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-medium"
              >
                <option value="all">All Animals</option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
                <option value="cow">Cows</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-2xl p-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <select className="border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm">
                  <option>All Conditions</option>
                  <option>Good</option>
                  <option>Injured</option>
                  <option>Pregnant</option>
                </select>
                <select className="border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm">
                  <option>Any Distance</option>
                  <option>Under 1km</option>
                  <option>Under 5km</option>
                  <option>Under 10km</option>
                </select>
                <select className="border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm">
                  <option>All Ages</option>
                  <option>Young</option>
                  <option>Adult</option>
                  <option>Senior</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600 text-lg">
            Showing{' '}
            <span className="font-bold text-indigo-600">
              {filteredAnimals.length}
            </span>{' '}
            animals near you
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-2xl">
            <span>Last updated: 1 Day ago</span>
          </div>
        </div>

        {/* Listings */}
        {viewMode === 'grid' ? <GridView /> : <ListView />}

        {/* Load More */}
        <div className="text-center mt-16">
          <button className="bg-white/80 backdrop-blur-sm text-gray-700 border-2 border-indigo-200 px-10 py-4 rounded-2xl font-bold hover:bg-white hover:border-indigo-400 transition-all duration-300 shadow-lg hover:shadow-xl">
            Load More Animals
          </button>
        </div>
        </div>
        </div>
        )}

        {/* Map */}
        {layoutMode === 'map' && (
          <div className="w-full min-h-screen bg-white p-6">
            <div className="h-[calc(100vh-12rem)] rounded-2xl overflow-hidden shadow-lg">
              <AdoptionMap 
                locations={generateMapLocations(filteredAnimals)} 
                selectedAnimal={selectedAnimalId}
              />
            </div>
          </div>
        )}
      </div>

      {/* Post Animal Modal */}
      {showPostModal && <PostModal setShowPostModal={handleCloseModal} />}

      {/* Adoption Modal */}
      {showAdoptionModal && selectedAnimal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Adopt {selectedAnimal.name}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Fill out this form to express your interest
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAdoptionModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Animal Summary */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8">
                  <div className="flex gap-6">
                    <img
                      src={selectedAnimal.image}
                      alt={selectedAnimal.name}
                      className="w-32 h-32 object-cover rounded-2xl"
                    />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedAnimal.name} ({selectedAnimal.type})
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Location:</span>{' '}
                          {selectedAnimal.location}
                        </div>
                        <div>
                          <span className="font-medium">Age:</span>{' '}
                          {selectedAnimal.age}
                        </div>
                        <div>
                          <span className="font-medium">Gender:</span>{' '}
                          {selectedAnimal.gender}
                        </div>
                        <div>
                          <span className="font-medium">Condition:</span>{' '}
                          {selectedAnimal.condition}
                        </div>
                      </div>
                      <p className="text-gray-600 mt-3">
                        {selectedAnimal.info}
                      </p>
                      <div className="mt-3 text-sm text-gray-500">
                        Posted by{' '}
                        <span className="font-medium">
                          {selectedAnimal.rescuer}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Adoption Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Personal Information
                    </h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={adoptionForm.adopterName}
                        onChange={e =>
                          setAdoptionForm({
                            ...adoptionForm,
                            adopterName: e.target.value,
                          })
                        }
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={adoptionForm.email}
                        onChange={e =>
                          setAdoptionForm({
                            ...adoptionForm,
                            email: e.target.value,
                          })
                        }
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={adoptionForm.phone}
                        onChange={e =>
                          setAdoptionForm({
                            ...adoptionForm,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        value={adoptionForm.address}
                        onChange={e =>
                          setAdoptionForm({
                            ...adoptionForm,
                            address: e.target.value,
                          })
                        }
                        placeholder="Your complete address"
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Adoption Details */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Adoption Details
                    </h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience with Animals
                      </label>
                      <select
                        value={adoptionForm.experience}
                        onChange={e =>
                          setAdoptionForm({
                            ...adoptionForm,
                            experience: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select experience level</option>
                        <option value="first-time">First time owner</option>
                        <option value="some">Some experience</option>
                        <option value="experienced">Very experienced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Housing Situation
                      </label>
                      <select
                        value={adoptionForm.housing}
                        onChange={e =>
                          setAdoptionForm({
                            ...adoptionForm,
                            housing: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select housing type</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House with yard</option>
                        <option value="farm">Farm/Large property</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Why do you want to adopt this animal?
                      </label>
                      <textarea
                        value={adoptionForm.reason}
                        onChange={e =>
                          setAdoptionForm({
                            ...adoptionForm,
                            reason: e.target.value,
                          })
                        }
                        placeholder="Tell us about your motivation to adopt..."
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        When can you pick up the animal?
                      </label>
                      <input
                        type="text"
                        value={adoptionForm.availability}
                        onChange={e =>
                          setAdoptionForm({
                            ...adoptionForm,
                            availability: e.target.value,
                          })
                        }
                        placeholder="e.g., Immediately, This weekend, Next week"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowAdoptionModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdoptionSubmit}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    Submit Adoption Request
                  </button>
                </div>

                {/* Contact Info */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Your request will be sent to{' '}
                    {selectedAnimal.rescuer}. They may contact you directly at{' '}
                    {selectedAnimal.contact} to discuss the adoption process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default StartRescuingPage
