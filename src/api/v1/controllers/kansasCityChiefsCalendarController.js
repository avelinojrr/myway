import { createCalendarEvent } from '../services/calendarService.js';
import { getChiefsCalendarEvents } from '../services/kansasCityChiefsService.js';
import { getScoreboard } from '../services/espnServiceNFL.js';

export const createChiefsCalendarEvent = async (req, res) => {
  try {
    // Obtenemos el scoreboard completo
    const scoreboardData = await getScoreboard();
    // Filtramos y mapeamos los partidos de los Chiefs
    const events = getChiefsCalendarEvents(scoreboardData);

    if (events.length === 0) {
      return res
        .status(404)
        .json({
          message:
            'No se encontraron eventos de los Kansas City Chiefs para sincronizar',
        });
    }

    // Tomamos el primer evento para insertar en Google Calendar (para pruebas)
    const eventToCreate = events[0];

    // Llamamos al servicio de Calendar para crear el evento
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
