import mongoose from 'mongoose';

const arrayLimit = (val: any[]) => val.length <= 4;

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 80,
  },
  category: {
    type: String,
    required: true,
    enum: ['News', 'Regulations', 'Announcements'],
  },
  bannerUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageAlt: {
    type: String,
    maxlength: 30,
  },
  seoTitle: {
    type: String,
    maxlength: 80,
  },
  seoDescription: {
    type: String,
  },
  articleSchemas: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
    validate: [arrayLimit, '{PATH} exceeds the limit of 4'],
  },
}, {
  timestamps: true,
});

export const Article = mongoose.model('Article', articleSchema);