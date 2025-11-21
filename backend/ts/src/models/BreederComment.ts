import mongoose, { Schema, Document } from 'mongoose'

export interface IBreederComment extends Document {
    breederId: string
    userId: string
    userName: string
    comment: string
    rating: number
    timestamp: Date
}

const BreederCommentSchema = new Schema<IBreederComment>({
    breederId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    timestamp: { type: Date, default: Date.now },
})

export default mongoose.model<IBreederComment>('BreederComment', BreederCommentSchema)
