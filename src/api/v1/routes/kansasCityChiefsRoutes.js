import { Router } from 'express';
import { fetchChiefsEvents } from '../controllers/kansasCityChiefsController.js';

const router = Router();

// Endpoint para obtener los eventos de los Kansas City Chiefs (solo para visualizar el mapeo)
router.get('/events', fetchChiefsEvents);

export default router;
