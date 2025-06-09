import mongoose, { Schema, Document } from 'mongoose';

interface IPaymentPlan {
  heading: string;
  subText: string;
}

interface IFAQ {
  question: string;
  answer: string;
}

interface IFeatureItem {
  title: string;
  iconName: string;
}

interface IFeatures {
  amenities: IFeatureItem[];
  access: IFeatureItem[];
  views: IFeatureItem[];
}

type UnitType =
  | 'Studio'
  | '1 BHK'
  | '2 BHK'
  | '3 BHK'
  | '2 BHK Duplex'
  | '3 BHK Duplex'
  | 'Penthouse';

interface UnitImages {
  [key: string]: string; // File path relative to 'backend/uploads'
}

interface FloorData {
  defaultLayout: string; // File path
  unitImages: UnitImages;
  selectedUnitTypes: UnitType[];
}

export interface IProperty extends Document {
  title: string;
  area: string;
  mainVideoUrl: string;
  price: string;
  images: string[];
  developer: string;
  brochure?: string;
  type: string;
  description: string;
  googleMapsEmbedLink: string;
  paymentPlans: IPaymentPlan[];
  faqs: IFAQ[];
  features: IFeatures;
  floors: Record<number, FloorData>; // NEW
}

const PaymentPlanSchema: Schema = new Schema({
  heading: { type: String, required: true },
  subText: { type: String, required: true },
}, { _id: false });

const FAQSchema: Schema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
}, { _id: false });

const FeatureItemSchema: Schema = new Schema({
  title: { type: String, required: true },
  iconName: { type: String, required: true },
}, { _id: false });

const FeaturesSchema: Schema = new Schema({
  amenities: [FeatureItemSchema],
  access: [FeatureItemSchema],
  views: [FeatureItemSchema],
}, { _id: false });

const FloorDataSchema: Schema = new Schema({
  defaultLayout: { type: String, required: false }, // File path
  unitImages: { type: Map, of: String, default: {} }, // Map<UnitType, file path>
  selectedUnitTypes: [{ type: String }],
}, { _id: false });

const PropertySchema: Schema = new Schema({
  title: { type: String, required: true },
  area: { type: String, required: true },
  mainVideoUrl: { type: String, required: true },
  price: { type: String, required: true },
  images: [{ type: String, required: true }],
  developer: { type: String, required: true },
  type: { type: String, required: true },
  brochure: { type: String },
  description: { type: String, required: true },
  googleMapsEmbedLink: { type: String, required: true },
  paymentPlans: [PaymentPlanSchema],
  faqs: [FAQSchema],
  features: FeaturesSchema,
  floors: {
    type: Map,
    of: FloorDataSchema,
    default: {},
  },
}, { timestamps: true });

export default mongoose.model<IProperty>('Property', PropertySchema);
