import mongoose, {Schema, Document} from "mongoose";

export interface IMarketplaceItem extends Document {
    name: string,
    seller: string,
    image: string,
    link: string,
};

const MarketplaceItemSchema = new Schema<IMarketplaceItem>({
    name: {type: String, required: true},
    seller: {type: String, required: true},
    image: {type: String, required: true},
    link: {type: String, required: true},
});

export default mongoose.model<IMarketplaceItem>('MarketplaceItem', MarketplaceItemSchema);
