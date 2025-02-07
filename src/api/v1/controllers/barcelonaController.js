import { getScoreboard } from '../services/espnServiceNBA.js'; // Reutilizamos la función del scoreboard
import { getBarcelonaCalendarEvents } from '../services/barcelonaService.js';

export const fetchBarcelonaEvents = async (req, res) => {
  try {
    // Obtenemos la data del scoreboard
    const scoreboardData = await getScoreboard();
    // Filtramos y mapeamos los partidos del Barcelona
    const events = getBarcelonaCalendarEvents(scoreboardData);

    if (events.length === 0) {
      return res
        .status(404)
        .json({
          message: 'No se encontraron eventos del Barcelona para sincronizar',
        });
    }

    res.status(200).json({ events });
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error al procesar los partidos del Barcelona',
        error: error.message,
      });
  }
};
