import mongoose from 'mongoose'

export interface IVet {
  name: string
  address: string
  location: {
    type: string
    coordinates: [number, number] // [longitude, latitude]
  }
  city: string
  state: string
  zipCode: string
  phone: string | null
  email?: string | null
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
  website?: string | null
  description?: string
}

const vetSchema = new mongoose.Schema<IVet>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    specialties: [{ type: String }],
    emergencyService: { type: Boolean, default: false },
    openingHours: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String,
    },
    website: { type: String },
    description: { type: String },
  },
  { timestamps: true }
)

// Create geospatial index for location-based queries
vetSchema.index({ location: '2dsphere' })

const Vet = mongoose.model<IVet>('Vet', vetSchema)

export default Vet
