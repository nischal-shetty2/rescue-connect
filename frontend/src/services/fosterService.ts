const API_URL = 'http://localhost:3000/api/fosters'

export interface FosterProfile {
    _id?: string
    name: string
    email: string
    phone: string
    location: {
        address: string
        lat: number
        lng: number
    }
    animalTypes: string[]
    duration: string
    experience: string
    status?: 'available' | 'busy'
    createdAt?: string
}

export const getFosters = async () => {
    const res = await fetch(API_URL)
    if (!res.ok) {
        throw new Error('Failed to fetch fosters')
    }
    return res.json()
}

export const createFoster = async (data: FosterProfile) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to create foster profile')
    }
    return res.json()
}
