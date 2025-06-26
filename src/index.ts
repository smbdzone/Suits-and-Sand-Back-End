// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import path from 'path';
import { connectDB } from './db';

// Import your routes here
import developerRoutes from './api/developers/developer.routes';
import jobRoutes from './api/jobs/job.routes';
import newsletterRoutes from './api/newsletter/newsletter.routes';
import propertyRoutes from './api/properties/property.routes'
import articleRoutes from './api/articles/article.routes'
import enquiryRoutes from './api/enquiries/enquiry.routes'
import applicationRoutes from './api/jobApplication/applications.routes'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

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

export default app;

