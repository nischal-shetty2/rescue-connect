import mongoose, { Schema, Document } from 'mongoose';

export interface IDonation extends Document {
  name: string;
  email: string;
  amount: number;
  donatedAt: Date;
}

const DonationSchema = new Schema<IDonation>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  donatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IDonation>('Donation', DonationSchema);