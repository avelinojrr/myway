import { getScoreboard } from '../services/espnService.js'; // Reutilizamos la función que ya tenemos
import { getLakersCalendarEvents } from '../services/lakersService.js';

export const fetchLakersEvents = async (req, res) => {
    try {
        // Obtener el scoreboard completo
        const scoreboardData = await getScoreboard();
        // Filtrar y mapear los partidos de los Lakers
        const calendarEvents = getLakersCalendarEvents(scoreboardData);
        res.status(200).json({ events: calendarEvents });
    } catch (error) {
        res.status(500).json({ message: 'Error al procesar los partidos de Los Angeles Lakers', error: error.message });
    }
};
