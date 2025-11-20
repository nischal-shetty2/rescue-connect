import mongoose, { Schema, Document } from 'mongoose';

export interface IStray extends Document {
    imageUrl: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    isSterilized: boolean;
    surveyData?: {
        earNotched: boolean;
        surgicalScars: boolean;
        behavior: string;
        skinCondition: string;
        notes?: string;
    };
    createdAt: Date;
}

const StraySchema: Schema = new Schema({
    imageUrl: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String, required: true }
    },
    isSterilized: { type: Boolean, default: false },
    surveyData: {
        earNotched: Boolean,
        surgicalScars: Boolean,
        behavior: String,
        skinCondition: String,
        notes: String
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IStray>('Stray', StraySchema);
