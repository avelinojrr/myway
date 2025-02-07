import { DateTime } from 'luxon';

/**
 * Filtra los partidos en los que aparece Los Angeles Dodgers.
 * @param {Array} events - Array de partidos obtenido del scoreboard.
 * @returns {Array} Array filtrado de partidos donde participan los Dodgers.
 */
export const filterDodgersGames = (events) => {
    return events.filter((game) => {
        if (!game.competitions || !game.competitions[0]) return false;
        const competitors = game.competitions[0].competitors;
        console.log('Competitors:', competitors.map(c => c.team.shortDisplayName));
        return competitors.some((competitor) =>
            competitor.team.shortDisplayName.toLowerCase().includes('dodgers')
        );
    });
};

/**
 * Mapea la información de un partido de Los Angeles Dodgers al formato de evento para Google Calendar.
 * @param {Object} game - Objeto del partido.
 * @returns {Object} Objeto formateado para Google Calendar.
 */
export const mapGameToCalendarEvent = (game) => {
    const competition = game.competitions[0];
    const competitors = competition.competitors;

    const dodgersCompetitor = competitors.find((comp) =>
        comp.team.shortDisplayName.toLowerCase().includes('dodgers')
    );
    const opponentCompetitor = competitors.find((comp) =>
        !comp.team.shortDisplayName.toLowerCase().includes('dodgers')
    );

    if (!dodgersCompetitor || !opponentCompetitor) {
        throw new Error('No se pudo identificar correctamente a los equipos del partido.');
    }

    const title = `${dodgersCompetitor.team.name} vs ${opponentCompetitor.team.name}`;
    const description = `Partido de MLB entre ${dodgersCompetitor.team.name} y ${opponentCompetitor.team.name} en ${competition.venue?.fullName || 'lugar no definido'}.`;

    // Convertimos la fecha/hora a la zona de Los Angeles
    const startLA = DateTime.fromISO(game.date, { zone: 'utc' }).setZone('America/Los_Angeles');
    const endLA = startLA.plus({ hours: 3 });

    const calendarEvent = {
        summary: title,
        description,
        start: {
            dateTime: startLA.toISO(),
            timeZone: 'America/Los_Angeles'
        },
        end: {
            dateTime: endLA.toISO(),
            timeZone: 'America/Los_Angeles'
        }
    };

    return calendarEvent;
};

/**
 * Función auxiliar que, dado el scoreboard, filtra y mapea los partidos de Los Angeles Dodgers.
 * @param {Object} scoreboardData - Objeto obtenido del endpoint de scoreboard.
 * @returns {Array} Array de eventos listos para enviar a Google Calendar.
 */
export const getDodgersCalendarEvents = (scoreboardData) => {
    const events = scoreboardData.events || [];
    const dodgersGames = filterDodgersGames(events);
    const calendarEvents = dodgersGames.map(mapGameToCalendarEvent);
    return calendarEvents;
};