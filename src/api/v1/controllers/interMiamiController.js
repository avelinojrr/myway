import { getScoreboard } from '../services/espnServiceSoccer.js';
import { getInterMiamiCalendarEvents } from '../services/interMiamiService.js';

export const fetchInterMiamiEvents = async (req, res) => {
  try {
    // Obtenemos la data completa del scoreboard (asegúrate de que incluya partidos de MLS)
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

    res.status(200).json({ events });
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error al procesar los partidos del Inter de Miami',
        error: error.message,
      });
  }
};
