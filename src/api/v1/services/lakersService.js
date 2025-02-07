import { DateTime } from 'luxon';

/**
 * Filtra los partidos en los que aparecen los Los Angeles Lakers.
 * @param {Array} events - Array de partidos obtenido del scoreboard.
 * @returns {Array} Array filtrado de partidos donde participan los Lakers.
 */
export const filterLakersGames = (events) => {
    return events.filter((game) => {
        // Verificamos que el partido tenga información de competencias
        if (!game.competitions || !game.competitions[0]) return false;
        const competitors = game.competitions[0].competitors;
        // Filtramos si alguno de los equipos contiene "lakers" en su 'shortDisplayName'
        return competitors.some((competitor) =>
            competitor.team.shortDisplayName.toLowerCase().includes('lakers')
        );
    });
};

/**
 * Mapea la información de un partido de los Lakers al formato de evento para Google Calendar.
 * @param {Object} game - Objeto del partido.
 * @returns {Object} Objeto formateado para ser usado en Google Calendar.
 */
export const mapGameToCalendarEvent = (game) => {
    const competition = game.competitions[0];
    const competitors = competition.competitors;

    // Identificamos al equipo Lakers y al equipo oponente
    const lakersCompetitor = competitors.find((comp) =>
        comp.team.shortDisplayName.toLowerCase().includes('lakers')
    );
    const opponentCompetitor = competitors.find((comp) =>
        !comp.team.shortDisplayName.toLowerCase().includes('lakers')
    );

    if (!lakersCompetitor || !opponentCompetitor) {
        throw new Error('No se pudo identificar correctamente a los equipos del partido.');
    }

    // Construir el título y la descripción del evento
    const title = `${lakersCompetitor.team.name} vs ${opponentCompetitor.team.name}`;
    const description = `Partido de la NBA entre ${lakersCompetitor.team.name} y ${opponentCompetitor.team.name} en ${competition.venue?.fullName || 'lugar no definido'}.`;

    // Convertir la fecha/hora del partido usando Luxon.
    // Se asume que game.date es una cadena ISO en UTC.
    const startLA = DateTime.fromISO(game.date, { zone: 'utc' }).setZone('America/Los_Angeles');
    const endLA = startLA.plus({ hours: 2 }); // Suponemos que el partido dura 2 horas

    // Formateamos el objeto para Google Calendar con el offset correcto.
    const calendarEvent = {
        summary: title,
        description,
        start: {
            dateTime: startLA.toISO(), // Ejemplo: "2025-02-07T20:00:00-08:00" (o el offset correspondiente)
            timeZone: 'America/Los_Angeles'
        },
        end: {
            dateTime: endLA.toISO(),   // Ejemplo: "2025-02-07T22:00:00-08:00"
            timeZone: 'America/Los_Angeles'
        }
    };

    return calendarEvent;
};

/**
 * Función auxiliar que, dado el scoreboard completo, filtra y mapea los partidos de los Lakers.
 * @param {Object} scoreboardData - Objeto obtenido del endpoint de scoreboard.
 * @returns {Array} Array de eventos listos para enviar a Google Calendar.
 */
export const getLakersCalendarEvents = (scoreboardData) => {
    const events = scoreboardData.events || [];
    const lakersGames = filterLakersGames(events);
    const calendarEvents = lakersGames.map(mapGameToCalendarEvent);
    return calendarEvents;
};
