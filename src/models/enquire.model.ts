// models/enquiry.model.ts

import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IEnquiry extends Document {
  firstName: string;
  lastName?: string;
  phone: string;
  email: string;
  budget: string;
  type: string;
  date: Date;
}

const EnquirySchema = new Schema<IEnquiry>({
  firstName: { type: String, required: true },
  lastName: { type: String }, // optional
  phone: { type: String, required: true },
  email: { type: String, required: true },
  budget: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const EnquiryModel = models.Enquiry || model<IEnquiry>("Enquiry", EnquirySchema);

export default EnquiryModel;
