import { Router } from 'express';
import { fetchChampionsEvents } from '../controllers/uefaChampionsController.js';

const router = Router();

// Endpoint para obtener todos los partidos de la Champions League (mapeados para Calendar)
router.get('/events', fetchChampionsEvents);

export default router;
