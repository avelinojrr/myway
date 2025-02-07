import { getScoreboard } from '../services/espnServiceNBA.js'; // Reutilizamos la función que obtiene el scoreboard
import { getHornetsCalendarEvents } from '../services/hornetsService.js';

export const fetchHornetsEvents = async (req, res) => {
  try {
    // Obtenemos la data completa del scoreboard
    const scoreboardData = await getScoreboard();
    // Filtramos y mapeamos los partidos de los Hornets
    const events = getHornetsCalendarEvents(scoreboardData);

    if (events.length === 0) {
      return res
        .status(404)
        .json({
          message: 'No se encontraron eventos de los Hornets para sincronizar',
        });
    }

    res.status(200).json({ events });
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error al procesar los partidos de los Hornets',
        error: error.message,
      });
  }
};
