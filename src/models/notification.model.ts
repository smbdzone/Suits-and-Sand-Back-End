import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['comment', 'contact', 'application'], required: true },
    user: {
      name: { type: String },
      avatar: { type: String, default: '' }
    },
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
    articleTitle: { type: String },
    description: { type: String },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
