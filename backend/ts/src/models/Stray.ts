import mongoose, { Schema, Document } from 'mongoose';

export interface IStray extends Document {
    imageUrl: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    animalType: string;
    gender: string;
    isSterilized: boolean;
    surveyData?: {
        earsNotched?: string;
        hasCollar?: string;
        surgicalMarks?: string;
        isLactating?: string;
        isPregnant?: string;
        recentlyDelivered?: string;
        testicularIssues?: string;
        isFriendly?: string;
        showsAggression?: string;
        allowsTouch?: string;
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
    animalType: { type: String, required: true },
    gender: { type: String, required: true },
    isSterilized: { type: Boolean, default: false },
    surveyData: {
        earsNotched: String,
        hasCollar: String,
        surgicalMarks: String,
        isLactating: String,
        isPregnant: String,
        recentlyDelivered: String,
        testicularIssues: String,
        isFriendly: String,
        showsAggression: String,
        allowsTouch: String,
        notes: String
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IStray>('Stray', StraySchema);
