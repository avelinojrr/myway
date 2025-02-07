import { Router } from 'express';
import { fetchInterMiamiEvents } from '../controllers/interMiamiController.js';

const router = Router();

// Endpoint para obtener los eventos del Inter de Miami
router.get('/events', fetchInterMiamiEvents);

export default router;
