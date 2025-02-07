import { Router } from 'express';
import { fetchLakersEvents } from '../controllers/lakersController.js';

const router = Router();

// Endpoint para obtener los eventos de los Lakers en formato Google Calendar
router.get('/events', fetchLakersEvents);

export default router;
