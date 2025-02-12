import express from 'express';
import { fetchTeamEvents, createTeamCalendarEvent } from '../controllers/sportsController.js';

const router = express.Router();

/**
 * Ruta para obtener eventos de un equipo/liga según el deporte.
 * Ejemplo de uso: GET /api/events/nba/lakers
 */
router.get('/events/:sport/:team', fetchTeamEvents);

/**
 * Ruta para crear un evento en Google Calendar basado en un equipo/liga.
 * Ejemplo de uso: POST /api/calendar/nba/lakers
 */
router.post('/calendar/:sport/:team', createTeamCalendarEvent);

export default router;