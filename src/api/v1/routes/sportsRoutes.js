import express from 'express';
import { fetchTeamEvents, createTeamCalendarEvent } from '../controllers/sportsController.js';

const router = express.Router();

// Middleware para manejar errores de authenticación
const handleAuthErrors = (err, req, res, next) => {
    if (err.message && (err.message.includes('invalid_grant') || err.message.includes('token expired'))) {
        return res.status(401).json({
            message: 'Error de autenticación con Google Calendar. Los tokens se actualizarán automáticamente en el próximo intento.',
            error: err.message,
        });
    }
    next(err);
};

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

// Aplicar middleware de manejo de errores
router.use(handleAuthErrors);

export default router;