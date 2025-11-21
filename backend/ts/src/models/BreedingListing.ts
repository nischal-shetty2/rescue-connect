import mongoose, { Schema, Document } from 'mongoose'

export interface IBreedingListing extends Document {
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
    postedAt: Date
}

const BreedingListingSchema = new Schema<IBreedingListing>({
    animalType: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    images: [String],
    awbiCertificate: { type: String, required: true },
    breederId: { type: String, required: true },
    breederName: { type: String, required: true },
    contactInfo: {
        phone: { type: String, required: true },
        email: { type: String, required: true },
    },
    location: { type: String, required: true },
    postedAt: { type: Date, default: Date.now },
})

export default mongoose.model<IBreedingListing>('BreedingListing', BreedingListingSchema)
