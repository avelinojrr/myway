import { DateTime } from 'luxon';

/**
 * Filtra los partidos en los que aparece los Hornets.
 * @param {Array} events - Array de partidos obtenido del scoreboard.
 * @returns {Array} Array filtrado de partidos donde participan los Hornets.
 */
export const filterHornetsGames = (events) => {
    return events.filter((game) => {
        // Verificamos que el partido tenga información de competencias
        if (!game.competitions || !game.competitions[0]) return false;
        const competitors = game.competitions[0].competitors;
        // Mostramos en consola los nombres para verificar
        console.log('Competitors:', competitors.map(c => c.team.shortDisplayName));
        // Filtramos si alguno de los equipos contiene "hornets" (en minúsculas)
        return competitors.some((competitor) =>
            competitor.team.shortDisplayName.toLowerCase().includes('hornets')
        );
    });
};

/**
 * Mapea la información de un partido de los Hornets al formato de evento para Google Calendar.
 * @param {Object} game - Objeto del partido.
 * @returns {Object} Objeto formateado para Google Calendar.
 */
export const mapGameToCalendarEvent = (game) => {
    const competition = game.competitions[0];
    const competitors = competition.competitors;

    // Identificamos al equipo Hornets y al oponente
    const hornetsCompetitor = competitors.find((comp) =>
        comp.team.shortDisplayName.toLowerCase().includes('hornets')
    );
    const opponentCompetitor = competitors.find((comp) =>
        !comp.team.shortDisplayName.toLowerCase().includes('hornets')
    );

    if (!hornetsCompetitor || !opponentCompetitor) {
        throw new Error('No se pudo identificar correctamente a los equipos del partido.');
    }

    // Construimos el título y la descripción del evento
    const title = `${hornetsCompetitor.team.name} vs ${opponentCompetitor.team.name}`;
    const description = `Partido de la NBA entre ${hornetsCompetitor.team.name} y ${opponentCompetitor.team.name} en ${competition.venue?.fullName || 'lugar no definido'}.`;

    // Convertimos la fecha/hora del partido usando Luxon.
    // Se asume que game.date es una cadena ISO en UTC.
    const startNY = DateTime.fromISO(game.date, { zone: 'utc' }).setZone('America/New_York');
    const endNY = startNY.plus({ hours: 2 });

    // Formateamos el objeto para Google Calendar con el offset adecuado.
    const calendarEvent = {
        summary: title,
        description,
        start: {
            dateTime: startNY.toISO(),  // Ejemplo: "2025-02-08T00:00:00-05:00"
            timeZone: 'America/New_York'
        },
        end: {
            dateTime: endNY.toISO(),    // Ejemplo: "2025-02-08T02:00:00-05:00"
            timeZone: 'America/New_York'
        }
    };

    return calendarEvent;
};

/**
 * Función auxiliar que, dado el scoreboard completo, filtra y mapea los partidos de los Hornets.
 * @param {Object} scoreboardData - Objeto obtenido del endpoint de scoreboard.
 * @returns {Array} Array de eventos listos para enviar a Google Calendar.
 */
export const getHornetsCalendarEvents = (scoreboardData) => {
    const events = scoreboardData.events || [];
    const hornetsGames = filterHornetsGames(events);
    const calendarEvents = hornetsGames.map(mapGameToCalendarEvent);
    return calendarEvents;
};
