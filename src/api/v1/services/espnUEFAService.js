import axios from 'axios';
import { DateTime } from 'luxon';

// Endpoint del scoreboard de la UEFA Champions League
const UEFA_CHAMPIONS_SCOREBOARD_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard';

/**
 * Obtiene el scoreboard de la UEFA Champions League.
 * @returns {Promise<Object>} Datos del scoreboard.
 */
export const getUefaChampionsScoreboard = async () => {
  try {
    const response = await axios.get(UEFA_CHAMPIONS_SCOREBOARD_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el scoreboard de la UEFA Champions League:", error);
    throw error;
  }
};

/**
 * Mapea la información de un partido de la UEFA Champions League al formato de evento para Google Calendar.
 * @param {Object} game - Objeto del partido.
 * @returns {Object} Evento formateado para Google Calendar.
 */
export const mapChampionsGameToCalendarEvent = (game) => {
  // Se asume que cada partido tiene al menos una competencia en game.competitions[0]
  const competition = game.competitions[0];
  const competitors = competition.competitors;

  // Construir el título concatenando el nombre de cada equipo
  const title = competitors.map(c => c.team.name).join(" vs ");
  const description = `Partido de la UEFA Champions League entre ${title} en ${competition.venue?.fullName || 'lugar no definido'}.`;

  // Convertir la fecha/hora del partido (se asume que game.date es ISO en UTC)
  // Ajustamos a la zona horaria "Europe/London" (puedes modificarla si es necesario)
  const startLondon = DateTime.fromISO(game.date, { zone: 'utc' }).setZone('Europe/London');
  // Asumimos una duración de 2 horas para el partido; ajusta si es necesario.
  const endLondon = startLondon.plus({ hours: 2 });

  return {
    summary: title,
    description,
    start: {
      dateTime: startLondon.toISO(), // Ejemplo: "2025-03-10T19:00:00+00:00"
      timeZone: 'Europe/London'
    },
    end: {
      dateTime: endLondon.toISO(),   // Ejemplo: "2025-03-10T21:00:00+00:00"
      timeZone: 'Europe/London'
    }
  };
};

/**
 * Dado el scoreboard de la UEFA Champions League, mapea **todos** los partidos al formato de evento para Google Calendar.
 * @param {Object} scoreboardData - Objeto obtenido del endpoint de scoreboard.
 * @returns {Array} Array de eventos listos para enviar a Google Calendar.
 */
export const getChampionsCalendarEvents = (scoreboardData) => {
  const events = scoreboardData.events || [];
  const calendarEvents = events.map(mapChampionsGameToCalendarEvent);
  return calendarEvents;
};
