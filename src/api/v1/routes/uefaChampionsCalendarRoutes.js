import { Router } from 'express';
import { createChampionsCalendarEvent } from '../controllers/uefaChampionsCalendarController.js';

const router = Router();

// Endpoint para crear un evento en Google Calendar para un partido de la Champions League
router.post('/uefa-champions', createChampionsCalendarEvent);

export default router;
