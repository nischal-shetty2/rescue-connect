const API_URL = 'http://localhost:3000/api/adoption-requests'

export interface AdoptionRequest {
    _id?: string
    animalId: string
    animalName: string
    animalType: string
    animalLocation: string
    rescuerName: string
    rescuerContact: string
    adopterInfo: {
        adopterName: string
        email: string
        phone: string
        address: string
        experience: string
        housing: string
        reason: string
        availability: string
    }
    status: 'pending' | 'approved' | 'rejected'
    submittedAt?: string
}

export const getAdoptionRequests = async () => {
    const res = await fetch(API_URL)
    if (!res.ok) {
        throw new Error('Failed to fetch adoption requests')
    }
    return res.json()
}

export const createAdoptionRequest = async (data: Omit<AdoptionRequest, '_id' | 'submittedAt'>) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to create adoption request')
    }
    return res.json()
}

export const updateAdoptionRequestStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    })
    if (!res.ok) {
        throw new Error('Failed to update adoption request')
    }
    return res.json()
}

export const deleteAdoptionRequest = async (id: string) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    })
    if (!res.ok) {
        throw new Error('Failed to delete adoption request')
    }
    return res.json()
}
