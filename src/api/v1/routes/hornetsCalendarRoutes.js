import { Router } from 'express';
import { createHornetsCalendarEvent } from '../controllers/hornetsCalendarController.js';

const router = Router();

// Endpoint para crear el evento de los Hornets en Google Calendar
router.post('/hornets', createHornetsCalendarEvent);

export default router;
