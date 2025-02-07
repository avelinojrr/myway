import { getScoreboard } from '../services/espnService.js';
import { getRedSoxCalendarEvents } from '../services/bostonRedSoxService.js';

export const fetchRedSoxEvents = async (req, res) => {
    try {
        const scoreboardData = await getScoreboard();
        const events = getRedSoxCalendarEvents(scoreboardData);
        if (events.length === 0) {
            return res.status(404).json({ message: "No se encontraron eventos de Boston Red Sox para sincronizar" });
        }
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ message: "Error al procesar los partidos de Boston Red Sox", error: error.message });
    }
};
