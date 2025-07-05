import express from 'express';
import { loginAdmin, logoutAdmin, getAdminProfile } from './auth.controller';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', getAdminProfile); 

export default router;
