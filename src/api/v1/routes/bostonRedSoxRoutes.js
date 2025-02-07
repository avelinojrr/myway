import { Router } from 'express';
import { fetchRedSoxEvents } from '../controllers/bostonRedSoxController.js';

const router = Router();

router.get('/events', fetchRedSoxEvents);

export default router;
