import { Router } from 'express';
import { createInterMiamiCalendarEvent } from '../controllers/interMiamiCalendarController.js';

const router = Router();

// Endpoint para crear un evento en Google Calendar basado en un partido del Inter de Miami
router.post('/inter-miami', createInterMiamiCalendarEvent);

export default router;
