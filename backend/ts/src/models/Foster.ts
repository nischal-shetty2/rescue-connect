import mongoose from 'mongoose'

const fosterSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        location: {
            address: { type: String, required: true },
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        animalTypes: [{ type: String, required: true }], // e.g., ['Dog', 'Cat']
        duration: { type: String, required: true }, // e.g., "2 weeks", "1 month"
        experience: { type: String, required: true },
        status: {
            type: String,
            enum: ['available', 'busy'],
            default: 'available',
        },
        userId: { type: String }, // Optional link to user account
    },
    { timestamps: true }
)

export const Foster = mongoose.model('Foster', fosterSchema)
