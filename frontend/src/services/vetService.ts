const API_URL = 'http://localhost:3000/api/vets'

export interface Vet {
  _id: string
  name: string
  address: string
  location: {
    type: string
    coordinates: [number, number] // [longitude, latitude]
  }
  city: string
  state: string
  zipCode: string
  phone: string
  email?: string
  rating: number
  specialties: string[]
  emergencyService: boolean
  openingHours: {
    monday?: string
    tuesday?: string
    wednesday?: string
    thursday?: string
    friday?: string
    saturday?: string
    sunday?: string
  }
  website?: string
  description?: string
  distance?: number // in meters
  distanceInKm?: number // in kilometers
}

export const getAllVets = async (): Promise<Vet[]> => {
  const res = await fetch(API_URL)
  if (!res.ok) {
    throw new Error('Failed to fetch vets')
  }
  return res.json()
}

export const getNearbyVets = async (
  latitude: number,
  longitude: number,
  maxDistance: number = 10000 // 10km default
): Promise<Vet[]> => {
  const url = `${API_URL}/nearby?latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch nearby vets')
  }
  return res.json()
}

export const getVetById = async (id: string): Promise<Vet> => {
  const res = await fetch(`${API_URL}/${id}`)
  if (!res.ok) {
    throw new Error('Failed to fetch vet details')
  }
  return res.json()
}

// Helper function to get user's current location
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      })
    }
  })
}
