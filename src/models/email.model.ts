import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  date: Date;
}

const EmailSchema = new Schema<INewsletter>({
  email: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
});

const EmailModel = models.Email || model<INewsletter>('Email', EmailSchema);

export default EmailModel;
