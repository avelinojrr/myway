import { getScoreboardBySport } from "../services/espnService.js";
import { getCalendarEventsByTeam } from "../services/eventFilterService.js";
import { createCalendarEvent } from "../services/calendarService.js";

/**
 * Controlador genérico para obtener eventos de un equipo o liga
 */
export const fetchTeamEvents = async (req, res) => {
    try {
        const { sport, team } = req.params;

        // Obtenemos los eventos del equipo
        const scoreboardData = await getScoreboardBySport(sport);

        // Filtramos los eventos del equipo
        const events = getCalendarEventsByTeam(scoreboardData, team);

        if(events.length === 0) {
            return res.status(404).json({
                message: `No se encontraron eventos para ${team}`,
            });
        }
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({
            message: "Error al procesar los eventos",
            error: error.message
        });
    }
};

/**
 * Controlador genérico para crear eventos en Google Calendar
 */
export const createTeamCalendarEvent = async (req, res) => {
    try {
        const { sport, team } = req.params;

        // Obtener scoreboard según el deporte
        const scoreboardData = await getScoreboardBySport(sport);

        // Filtrar los eventos del equipo especificado
        const events = getCalendarEventsByTeam(scoreboardData, team);

        if (events.length === 0) {
            return res.status(404).json({
                message: `No se encontraron eventos para ${team}`,
            });
        }

        const createdEvents = [];

        // Iterar sobre cada evento y guardarlo en Google Calendar
        for (const event of events) {
            try {
                const calendarResponse = await createCalendarEvent(event);
                createdEvents.push(calendarResponse);
                console.log(`✅ Evento "${event.summary}" creado en Google Calendar.`);
            } catch (error) {
                console.error(`⚠️ Error al crear el evento "${event.summary}":`, error.message);
            }
        }

        res.status(200).json({
            message: `Eventos de ${team} creados en Google Calendar exitosamente`,
            createdEvents,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear los eventos en Google Calendar',
            error: error.message,
        });
    }
};
