import mongoose, { Schema, Document } from 'mongoose'

export interface IAdoption extends Document {
  animalName: string
  animalType: string
  breed: string
  age: number
  gender: string
  size: string
  description: string
  medicalInfo: string
  location: string
  contactInfo: {
    name: string
    phone: string
    email: string
  }
  images: string[]
  status: string
  postedBy: string
  postedAt: Date
}

const AdoptionSchema = new Schema<IAdoption>({
  animalName: { type: String, required: true },
  animalType: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  size: { type: String, required: true },
  description: { type: String, required: true },
  medicalInfo: { type: String },
  location: { type: String, required: true },
  contactInfo: {
    name: String,
    phone: String,
    email: String,
  },
  images: [String],
  status: { type: String, default: 'available' },
  postedBy: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
})

export default mongoose.model<IAdoption>('Adoption', AdoptionSchema)
