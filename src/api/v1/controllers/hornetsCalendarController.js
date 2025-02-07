import { createCalendarEvent } from '../services/calendarService.js';
import { getHornetsCalendarEvents } from '../services/hornetsService.js';
import { getScoreboard } from '../services/espnService.js';

export const createHornetsCalendarEvent = async (req, res) => {
    try {
        // Obtenemos la data completa del scoreboard
        const scoreboardData = await getScoreboard();
        // Filtramos y mapeamos los partidos de los Hornets
        const events = getHornetsCalendarEvents(scoreboardData);

        if (events.length === 0) {
            return res.status(404).json({ message: "No se encontraron eventos de los Hornets para sincronizar" });
        }

        // Para efectos de prueba, tomamos el primer evento encontrado
        const eventToCreate = events[0];

        // Llamamos al servicio de Calendar para crear el evento
        const calendarResponse = await createCalendarEvent(eventToCreate);

        res.status(200).json({
            message: "Evento creado en Google Calendar exitosamente",
            calendarResponse
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al crear el evento en Google Calendar",
            error: error.message
        });
    }
};