import { getUefaChampionsScoreboard, getChampionsCalendarEvents } from '../services/espnUEFAService.js';

export const fetchChampionsEvents = async (req, res) => {
  try {
    const scoreboardData = await getUefaChampionsScoreboard();
    const events = getChampionsCalendarEvents(scoreboardData);
    if (events.length === 0) {
      return res.status(404).json({ message: "No se encontraron partidos en la UEFA Champions League." });
    }
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({
      message: "Error al procesar los partidos de la UEFA Champions League",
      error: error.message
    });
  }
};
