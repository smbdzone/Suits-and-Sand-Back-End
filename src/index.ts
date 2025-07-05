// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import path from 'path';
import { connectDB } from './db';
import cookieParser from 'cookie-parser';

// Import your routes here
import developerRoutes from './api/developers/developer.routes';
import jobRoutes from './api/jobs/job.routes';
import newsletterRoutes from './api/newsletter/newsletter.routes';
import propertyRoutes from './api/properties/property.routes'
import articleRoutes from './api/articles/article.routes'
import enquiryRoutes from './api/enquiries/enquiry.routes'
import applicationRoutes from './api/jobApplication/applications.routes'
import commentRoutes from './api/comments/comment.routes'
import notificationRoutes from './api/notifications/notification.routes';
import authRoutes from './api/auth/auth.routes';
import userRoutes from './api/users/user.routes';
import analyticsRoutes from './api/analytics/routes';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  'https://suits-and-sand-front-end.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));
app.use(cookieParser());


// Static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


// Connect to DB
connectDB();

// API Routes
app.use('/api/developers', developerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/properties', propertyRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/enquiries', enquiryRoutes)
app.use('/api/jobApplication', applicationRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);



app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export default app;

