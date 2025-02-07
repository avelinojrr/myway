import { Router } from 'express';
import { fetchHornetsEvents } from '../controllers/hornetsController.js';

const router = Router();

// Endpoint para obtener los eventos de los Hornets
router.get('/events', fetchHornetsEvents);

export default router;
