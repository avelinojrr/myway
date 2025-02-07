import { createCalendarEvent } from '../services/calendarService.js';
import { getInterMiamiCalendarEvents } from '../services/interMiamiService.js';
import { getScoreboard } from '../services/espnServiceSoccer.js';

export const createInterMiamiCalendarEvent = async (req, res) => {
  try {
    // Obtenemos la data completa del scoreboard (asegúrate de que incluya partidos de Inter de Miami)
    const scoreboardData = await getScoreboard();

    // Filtramos y mapeamos los partidos del Inter de Miami
    const events = getInterMiamiCalendarEvents(scoreboardData);

    if (events.length === 0) {
      return res
        .status(404)
        .json({
          message:
            'No se encontraron eventos del Inter de Miami para sincronizar',
        });
    }

    // Para efectos de prueba, tomamos el primer evento encontrado
    const eventToCreate = events[0];

    // Llamamos al servicio de Calendar para crear el evento en Google Calendar
    const calendarResponse = await createCalendarEvent(eventToCreate);

    res.status(200).json({
      message: 'Evento creado en Google Calendar exitosamente',
      calendarResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear el evento en Google Calendar',
      error: error.message,
    });
  }
};
