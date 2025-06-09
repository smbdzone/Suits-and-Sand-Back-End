import mongoose, { Schema, Document } from 'mongoose';

export interface IDeveloper extends Document {
  title: string;
  logoUrl: string; 
  description: string;
}

const DeveloperSchema: Schema = new Schema({
  title: { type: String, required: true },
  logoUrl: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IDeveloper>('Developer', DeveloperSchema);
