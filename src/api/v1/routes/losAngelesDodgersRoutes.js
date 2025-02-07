import { Router } from 'express';
import { fetchDodgersEvents } from '../controllers/losAngelesDodgersController.js';

const router = Router();

router.get('/events', fetchDodgersEvents);

export default router;
