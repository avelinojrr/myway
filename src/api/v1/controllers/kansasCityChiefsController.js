import { getScoreboard } from '../services/espnService.js';  // Asumimos que ya tienes este servicio implementado
import { getChiefsCalendarEvents } from '../services/kansasCityChiefsService.js';

export const fetchChiefsEvents = async (req, res) => {
    try {
        // Obtenemos la data completa del scoreboard
        const scoreboardData = await getScoreboard();
        // Filtramos y mapeamos los partidos de los Chiefs
        const events = getChiefsCalendarEvents(scoreboardData);

        if (events.length === 0) {
            return res.status(404).json({ message: "No se encontraron eventos de los Kansas City Chiefs para sincronizar" });
        }

        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ message: "Error al procesar los partidos de los Kansas City Chiefs", error: error.message });
    }
};
