import express from 'express';
import { submitEnquiries, getAllEnquiries } from './enquiry.controller';

const router = express.Router();

router.post('/', submitEnquiries);
router.get('/', getAllEnquiries);

export default router;
