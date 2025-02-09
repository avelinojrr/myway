import { DateTime } from 'luxon';

/**
 * Filtra los partidos en los que aparece el Barcelona.
 * @param {Array} events - Array de partidos obtenido del scoreboard.
 * @returns {Array} Array filtrado de partidos donde participa el Barcelona.
 */
export const filterBarcelonaGames = (events) => {
    return events.filter((game) => {
        // Verificamos que el partido tenga información de competencias
        if (!game.competitions || !game.competitions[0]) return false;
        const competitors = game.competitions[0].competitors;
        // Imprimimos en consola los nombres para verificar
        // Filtramos si alguno de los equipos contiene "barcelona"
        return competitors.some((competitor) =>
            competitor.team.shortDisplayName.toLowerCase().includes('barcelona')
        );
    });
};

/**
 * Mapea la información de un partido del Barcelona al formato de evento para Google Calendar.
 * @param {Object} game - Objeto del partido.
 * @returns {Object} Objeto formateado para Google Calendar.
 */
export const mapGameToCalendarEvent = (game) => {
    const competition = game.competitions[0];
    const competitors = competition.competitors;

    // Identificamos al equipo Barcelona y al oponente
    const barcelonaCompetitor = competitors.find((comp) =>
        comp.team.shortDisplayName.toLowerCase().includes('barcelona')
    );
    const opponentCompetitor = competitors.find((comp) =>
        !comp.team.shortDisplayName.toLowerCase().includes('barcelona')
    );

    if (!barcelonaCompetitor || !opponentCompetitor) {
        throw new Error('No se pudo identificar correctamente a los equipos del partido.');
    }

    // Construimos el título y la descripción del evento
    const title = `${barcelonaCompetitor.team.name} vs ${opponentCompetitor.team.name}`;
    const description = `Partido de fútbol entre ${barcelonaCompetitor.team.name} y ${opponentCompetitor.team.name} en ${competition.venue?.fullName || 'lugar no definido'}.`;

    // Convertimos la fecha/hora del partido usando Luxon.
    // Se asume que game.date es una cadena ISO en UTC.
    const startMadrid = DateTime.fromISO(game.date, { zone: 'utc' }).setZone('Europe/Madrid');
    const endMadrid = startMadrid.plus({ hours: 2 }); // Asumimos que el partido dura 2 horas

    // Formateamos el objeto para Google Calendar con el offset correcto.
    const calendarEvent = {
        summary: title,
        description,
        start: {
            dateTime: startMadrid.toISO(), // Ejemplo: "2025-02-08T00:00:00+01:00" o el offset correspondiente
            timeZone: 'Europe/Madrid'
        },
        end: {
            dateTime: endMadrid.toISO(),   // Ejemplo: "2025-02-08T02:00:00+01:00"
            timeZone: 'Europe/Madrid'
        }
    };

    return calendarEvent;
};

/**
 * Función que, dado el scoreboard completo, filtra y mapea los partidos del Barcelona.
 * @param {Object} scoreboardData - Objeto obtenido del endpoint de scoreboard.
 * @returns {Array} Array de eventos listos para enviar a Google Calendar.
 */
export const getBarcelonaCalendarEvents = (scoreboardData) => {
    const events = scoreboardData.events || [];
    const barcelonaGames = filterBarcelonaGames(events);
    const calendarEvents = barcelonaGames.map(mapGameToCalendarEvent);
    return calendarEvents;
};
