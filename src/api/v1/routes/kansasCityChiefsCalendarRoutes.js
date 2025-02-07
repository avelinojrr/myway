import { Router } from 'express';
import { createChiefsCalendarEvent } from '../controllers/kansasCityChiefsCalendarController.js';

const router = Router();

// Endpoint para crear un evento en Google Calendar basado en un partido de los Kansas City Chiefs
router.post('/kansas-city-chief', createChiefsCalendarEvent);

export default router;
