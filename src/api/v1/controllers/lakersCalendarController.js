import { createCalendarEvent } from "../services/calendarService.js";
import { getLakersCalendarEvents } from "../services/lakersService.js";
import { getScoreboard } from "../services/espnService.js";

/**
 * Controlador para crear un evento en Google Calendar basado en el partido de los Lakers.
 * Para propósitos de prueba, se toma el primer evento encontrado.
 */
export const createLakersEvent = async (req, res) => {
    try {
        // Obtenemos la data del scoreboard
        const scoreboardData = await getScoreboard();
        // Filtramos y mapeamos los partidos de los Lakers al formato de evento
        const events = getLakersCalendarEvents(scoreboardData);

        if (events.length === 0) {
            return res.status(404).json({
                message: "No se encontraron eventos de los Lakers para sincronizar",
            });
        }

        // Por ejemplo, seleccionamos el primer evento para crear el evento en Google Calendar
        const eventData = events[0];

        const calendarResponse = await createCalendarEvent(eventData);

        res.status(200).json({
            message: "Evento creado en Google Calendar exitosamente",
            calendarResponse,
        });
    } catch (error) {
        res.status(400).json({
            message: "Error al crear el evento en Google Calendar",
            error: error.message,
        });
    }
};