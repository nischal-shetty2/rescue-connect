const API_URL = 'http://localhost:3000/api/breeding'

export interface BreedingListing {
    _id: string
    animalType: string
    breed: string
    age: number
    gender: string
    price: number
    description: string
    images: string[]
    awbiCertificate: string
    breederId: string
    breederName: string
    contactInfo: {
        phone: string
        email: string
    }
    location: string
    postedAt: string
}

export const getBreedingListings = async () => {
    const res = await fetch(`${API_URL}/listings`)
    if (!res.ok) {
        throw new Error('Failed to fetch breeding listings')
    }
    return res.json()
}

export const createBreedingListing = async (data: any) => {
    const res = await fetch(`${API_URL}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to create breeding listing')
    }
    return res.json()
}

export const getBreederComments = async (breederId: string) => {
    const res = await fetch(`${API_URL}/comments/${breederId}`)
    if (!res.ok) {
        throw new Error('Failed to fetch comments')
    }
    return res.json()
}

export const addBreederComment = async (data: any) => {
    const res = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to add comment')
    }
    return res.json()
}
