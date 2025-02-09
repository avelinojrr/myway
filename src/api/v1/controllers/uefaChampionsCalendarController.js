import { createCalendarEvent } from '../services/calendarService.js';
import { getUefaChampionsScoreboard, getChampionsCalendarEvents } from '../services/espnUEFAService.js';

export const createChampionsCalendarEvent = async (req, res) => {
  try {
    // Obtiene el scoreboard de la Champions League
    const scoreboardData = await getUefaChampionsScoreboard();
    // Mapea todos los partidos al formato de evento para Google Calendar
    const events = getChampionsCalendarEvents(scoreboardData);
    
    if (events.length === 0) {
      return res.status(404).json({ message: "No se encontraron partidos para sincronizar." });
    }
    
    const createdEvents = [];
    
    // Itera sobre todos los eventos y crea cada uno en Google Calendar
    for (const event of events) {
      try {
        const calendarResponse = await createCalendarEvent(event);
        createdEvents.push(calendarResponse);
        console.log(`Evento "${event.summary}" creado con ID: ${calendarResponse.id}`);
      } catch (eventError) {
        console.error(`Error al crear el evento "${event.summary}":`, eventError.message);
        // Opcional: puedes continuar o detener la ejecución según tus necesidades.
      }
    }
    
    res.status(200).json({
      message: "Eventos de la UEFA Champions League creados en Google Calendar exitosamente",
      createdEvents
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear los eventos en Google Calendar",
      error: error.message
    });
  }
};
