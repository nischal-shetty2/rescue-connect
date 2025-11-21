import mongoose, { Schema, Document } from 'mongoose'

export interface IAdoptionRequest extends Document {
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
    submittedAt: Date
}

const AdoptionRequestSchema = new Schema<IAdoptionRequest>({
    animalId: { type: String, required: true },
    animalName: { type: String, required: true },
    animalType: { type: String, required: true },
    animalLocation: { type: String, required: true },
    rescuerName: { type: String, required: true },
    rescuerContact: { type: String, required: true },
    adopterInfo: {
        adopterName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: String,
        experience: String,
        housing: String,
        reason: String,
        availability: String,
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    submittedAt: { type: Date, default: Date.now },
})

export default mongoose.model<IAdoptionRequest>('AdoptionRequest', AdoptionRequestSchema)
