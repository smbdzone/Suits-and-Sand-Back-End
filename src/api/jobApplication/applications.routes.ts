import express from 'express';
import { upload, submitApplication } from './submitApplication.controller';

const router = express.Router();

router.post('/', upload, submitApplication);

export default router;
