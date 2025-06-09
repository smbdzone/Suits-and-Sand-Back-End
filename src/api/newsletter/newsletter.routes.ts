import { Router } from 'express';
import { getNewsletterSubscribers, subscribeNewsletter } from './newsletter.controller';

const router = Router();

router.post('/', subscribeNewsletter);
router.get('/', getNewsletterSubscribers);

export default router;
