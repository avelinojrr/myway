import { getScoreboard } from '../services/espnService.js';
import { getDodgersCalendarEvents } from '../services/losAngelesDodgersService.js';

export const fetchDodgersEvents = async (req, res) => {
    try {
        const scoreboardData = await getScoreboard();
        const events = getDodgersCalendarEvents(scoreboardData);
        if (events.length === 0) {
            return res.status(404).json({ message: "No se encontraron eventos de Los Angeles Dodgers para sincronizar" });
        }
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ message: "Error al procesar los partidos de Los Angeles Dodgers", error: error.message });
    }
};