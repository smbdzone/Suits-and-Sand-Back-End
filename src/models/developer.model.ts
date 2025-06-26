import mongoose, { Schema, Document } from 'mongoose';

export interface IDeveloper extends Document {
  title: string;
  logoUrl: string; 
  description: string;
  numberOfProjects: number;
  projectsHandedOver: number;
}

const DeveloperSchema: Schema = new Schema({
  title: { type: String, required: true },
  logoUrl: { type: String, required: true },
  description: { type: String, required: true },
  numberOfProjects: { type: Number, default: 0 },
  projectsHandedOver: { type: Number, default: 0 }
}, { timestamps: true });


export default mongoose.model<IDeveloper>('Developer', DeveloperSchema);
