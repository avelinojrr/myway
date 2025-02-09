import { DateTime } from 'luxon';

/**
 * Filtra los partidos en los que aparece Boston Red Sox.
 * @param {Array} events - Array de partidos obtenido del scoreboard.
 * @returns {Array} Array filtrado de partidos donde participan los Red Sox.
 */
export const filterRedSoxGames = (events) => {
    return events.filter((game) => {
        if (!game.competitions || !game.competitions[0]) return false;
        const competitors = game.competitions[0].competitors;
        return competitors.some((competitor) =>
            competitor.team.shortDisplayName.toLowerCase().includes('red sox')
        );
    });
};

/**
 * Mapea la información de un partido de Boston Red Sox al formato de evento para Google Calendar.
 * @param {Object} game - Objeto del partido.
 * @returns {Object} Objeto formateado para Google Calendar.
 */
export const mapGameToCalendarEvent = (game) => {
    const competition = game.competitions[0];
    const competitors = competition.competitors;

    const redSoxCompetitor = competitors.find((comp) =>
        comp.team.shortDisplayName.toLowerCase().includes('red sox')
    );
    const opponentCompetitor = competitors.find((comp) =>
        !comp.team.shortDisplayName.toLowerCase().includes('red sox')
    );

    if (!redSoxCompetitor || !opponentCompetitor) {
        throw new Error('No se pudo identificar correctamente a los equipos del partido.');
    }

    const title = `${redSoxCompetitor.team.name} vs ${opponentCompetitor.team.name}`;
    const description = `Partido de MLB entre ${redSoxCompetitor.team.name} y ${opponentCompetitor.team.name} en ${competition.venue?.fullName || 'lugar no definido'}.`;

    // Convertimos la fecha/hora (se asume que game.date es ISO en UTC) a la zona de Boston (America/New_York)
    const startBoston = DateTime.fromISO(game.date, { zone: 'utc' }).setZone('America/New_York');
    // Asumimos que un juego dura aproximadamente 3 horas
    const endBoston = startBoston.plus({ hours: 3 });

    const calendarEvent = {
        summary: title,
        description,
        start: {
            dateTime: startBoston.toISO(),  // Ejemplo: "2025-03-10T19:00:00-04:00"
            timeZone: 'America/New_York'
        },
        end: {
            dateTime: endBoston.toISO(),    // Ejemplo: "2025-03-10T22:00:00-04:00"
            timeZone: 'America/New_York'
        }
    };

    return calendarEvent;
};

/**
 * Función que, dado el scoreboard, filtra y mapea los partidos de Boston Red Sox.
 * @param {Object} scoreboardData - Objeto obtenido del endpoint de scoreboard.
 * @returns {Array} Array de eventos listos para enviar a Google Calendar.
 */
export const getRedSoxCalendarEvents = (scoreboardData) => {
    const events = scoreboardData.events || [];
    const redSoxGames = filterRedSoxGames(events);
    const calendarEvents = redSoxGames.map(mapGameToCalendarEvent);
    return calendarEvents;
};