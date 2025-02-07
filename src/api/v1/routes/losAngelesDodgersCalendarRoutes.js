import { Router } from 'express';
import { createDodgersCalendarEvent } from '../controllers/losAngelesDodgersCalendarController.js';

const router = Router();

router.post('/los-angeles-dodgers', createDodgersCalendarEvent);

export default router;
