"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// -------------------------
// Sub Schemas
// -------------------------
const FeatureSchema = new mongoose_1.Schema({
    id: String,
    iconName: String,
    icon: String,
    title: String,
    isSelected: Boolean,
}, { _id: false });
const PaymentPlanSchema = new mongoose_1.Schema({
    heading: String,
    subText: String,
}, { _id: false });
const FAQSchema = new mongoose_1.Schema({
    question: String,
    answer: String,
}, { _id: false });
const UnitVariantSchema = new mongoose_1.Schema({
    variantName: String,
    image: String,
}, { _id: false });
const UnitImageDataSchema = new mongoose_1.Schema({
    image: String,
    variants: [UnitVariantSchema],
}, { _id: false });
const FloorDataSchema = new mongoose_1.Schema({
    defaultLayout: String,
    // ✅ This is how we handle dynamic keys like "Studio", "2 BHK", etc.
    unitImages: {
        type: Map,
        of: UnitImageDataSchema,
        default: {},
    },
    selectedUnitTypes: [String],
}, { _id: false });
// -------------------------
// Main Schema
// -------------------------
const PropertySchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    area: { type: String, required: true },
    price: { type: String, required: true },
    mainVideoUrl: { type: String },
    developer: { type: String, required: true },
    type: { type: String, required: true },
    images: [{ type: String, required: true }],
    brochureFile: { type: String },
    quarter: { type: String, required: true },
    year: { type: String, required: true },
    paymentPlans: {
        type: Map,
        of: [PaymentPlanSchema],
        default: {},
    },
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
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('Property', PropertySchema);
