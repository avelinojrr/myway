import { Router } from 'express';
import { fetchBarcelonaEvents } from '../controllers/barcelonaController.js';

const router = Router();

// Definimos la ruta GET para obtener los eventos de Barcelona
router.get('/events', fetchBarcelonaEvents);

export default router;
