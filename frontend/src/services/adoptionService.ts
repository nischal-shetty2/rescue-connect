const API_URL = 'http://localhost:3000/api/adoptions'

export interface AdoptionPost {
  _id?: string
  animalName: string
  animalType: 'dog' | 'cat' | 'bird' | 'other'
  breed: string
  age: number
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  description: string
  medicalInfo: string
  location: string
  coordinates?: {
    lat: number
    lng: number
  }
  contactInfo: {
    name: string
    phone: string
    email: string
  }
  images: string[]
  status: 'available' | 'pending' | 'adopted'
  postedBy: string
  postedAt?: string
  updatedAt?: string
}

export const getAdoptions = async (filters?: {
  type?: string
  location?: string
}) => {
  let url = API_URL

  if (filters && (filters.type || filters.location)) {
    const params = new URLSearchParams()
    if (filters.type && filters.type !== 'all') {
      params.append('type', filters.type)
    }
    if (filters.location) {
      params.append('location', filters.location)
    }
    url += `?${params.toString()}`
  }

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch adoptions')
  }
  return res.json()
}

export const createAdoption = async (data: any) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('failed to fetch')
  }
  return res.json()
}

export const deleteAdoption = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    throw new Error('Failed to delete adoption')
  }
  return res.json()
}
