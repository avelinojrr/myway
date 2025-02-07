import { createCalendarEvent } from '../services/calendarService.js';
import { getDodgersCalendarEvents } from '../services/losAngelesDodgersService.js';
import { getScoreboard } from '../services/espnServiceNBA.js';

export const createDodgersCalendarEvent = async (req, res) => {
  try {
    const scoreboardData = await getScoreboard();
    const events = getDodgersCalendarEvents(scoreboardData);
    if (events.length === 0) {
      return res
        .status(404)
        .json({
          message:
            'No se encontraron eventos de Los Angeles Dodgers para sincronizar',
        });
    }
    const eventToCreate = events[0];
    const calendarResponse = await createCalendarEvent(eventToCreate);
    res
      .status(200)
      .json({
        message: 'Evento creado en Google Calendar exitosamente',
        calendarResponse,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error al crear el evento en Google Calendar',
        error: error.message,
      });
  }
};
