import { Router } from 'express';
import { createLakersEvent } from '../controllers/lakersCalendarController.js';

const router = Router();

// Ruta para crear un evento en Google Calendar basado en un partido de los Lakers.
// Se utilizará un método POST para que quede semánticamente correcto.
router.post('/lakers', createLakersEvent);

export default router;
