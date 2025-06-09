import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 50 },
  description: { type: String, required: true },
  remunerationType: { type: String, enum: ['commission', 'salary'], required: true },
  commission: { type: String },
  salary: { type: String },
}, {
  timestamps: true
});

export const Job = mongoose.model('Job', jobSchema);
