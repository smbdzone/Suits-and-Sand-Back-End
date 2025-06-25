import mongoose, { Schema, Document } from 'mongoose';

interface Feature {
  id: string;
  iconName: string;
  title: string;
  isSelected: boolean;
}

interface PaymentPlan {
  heading: string;
  subText: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface UnitImages {
  [key: string]: string; 
}

interface FloorData {
  defaultLayout: string; 
  unitImages: UnitImages;
  selectedUnitTypes: string[]; 
}

export interface IProperty extends Document {
  title: string;
  area: string;
  price: string;
  mainVideoUrl: string;
  developer: string;
  type: string;
  images: string[]; // image URLs or paths

  brochureFile?: string;
  paymentPlans: PaymentPlan[];
  faqs: FAQ[];

  amenities: Feature[];
  access: Feature[];
  views: Feature[];

  description: string;
  longitude: string;
  latitude: string;

  numFloors: number;
  floors: {
    [floorNumber: number]: FloorData;
  };
}

const FeatureSchema = new Schema<Feature>(
  {
    id: String,
    iconName: String,
    title: String,
    isSelected: Boolean,
  },
  { _id: false }
);

const PaymentPlanSchema = new Schema<PaymentPlan>(
  {
    heading: String,
    subText: String,
  },
  { _id: false }
);

const FAQSchema = new Schema<FAQ>(
  {
    question: String,
    answer: String,
  },
  { _id: false }
);

const UnitImagesSchema = new Schema(
  {
    // keys will be dynamic (unitType)
  },
  { _id: false, strict: false } // allow dynamic unit type keys
);

const FloorDataSchema = new Schema<FloorData>(
  {
    defaultLayout: String,
    unitImages: UnitImagesSchema,
    selectedUnitTypes: [String],
  },
  { _id: false }
);

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    area: { type: String, required: true },
    price: { type: String, required: true },
    mainVideoUrl: { type: String },
    developer: { type: String, required: true },
    type: { type: String, required: true },
    images: [{ type: String, required: true }],

    brochureFile: { type: String },
    paymentPlans: [PaymentPlanSchema],
    faqs: [FAQSchema],

    amenities: [FeatureSchema],
    access: [FeatureSchema],
    views: [FeatureSchema],

    description: { type: String, required: true },
    longitude: { type: String, required: true },
    latitude: { type: String, required: true },

    numFloors: { type: Number, required: true },
    floors: {
      type: Map,
      of: FloorDataSchema,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProperty>('Property', PropertySchema);
