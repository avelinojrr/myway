import { DateTime } from 'luxon';

/**
 * Filtra los partidos en los que aparece el equipo Kansas City Chiefs.
 * @param {Array} events - Array de partidos obtenido del scoreboard.
 * @returns {Array} Array filtrado de partidos donde participan los Chiefs.
 */
export const filterChiefsGames = (events) => {
    return events.filter((game) => {
        // Verificamos que el partido tenga información de competencias
        if (!game.competitions || !game.competitions[0]) return false;
        const competitors = game.competitions[0].competitors;
        // Para verificar, imprimimos en consola los nombres de los equipos
        console.log('Competitors:', competitors.map(c => c.team.shortDisplayName));
        // Filtramos si alguno de los equipos contiene "chief" (esto cubrirá "Chiefs")
        return competitors.some((competitor) =>
            competitor.team.shortDisplayName.toLowerCase().includes('chief')
        );
    });
};

/**
 * Mapea la información de un partido de los Kansas City Chiefs al formato de evento para Google Calendar.
 * @param {Object} game - Objeto del partido.
 * @returns {Object} Objeto formateado para ser usado en Google Calendar.
 */
export const mapGameToCalendarEvent = (game) => {
    const competition = game.competitions[0];
    const competitors = competition.competitors;

    // Identificamos al equipo Kansas City Chiefs y al oponente.
    const chiefsCompetitor = competitors.find((comp) =>
        comp.team.shortDisplayName.toLowerCase().includes('chief')
    );
    const opponentCompetitor = competitors.find((comp) =>
        !comp.team.shortDisplayName.toLowerCase().includes('chief')
    );

    if (!chiefsCompetitor || !opponentCompetitor) {
        throw new Error('No se pudo identificar correctamente a los equipos del partido.');
    }

    // Construimos el título y la descripción del evento.
    const title = `${chiefsCompetitor.team.name} vs ${opponentCompetitor.team.name}`;
    const description = `Partido de la NFL entre ${chiefsCompetitor.team.name} y ${opponentCompetitor.team.name} en ${competition.venue?.fullName || 'lugar no definido'}.`;

    // Convertimos la fecha/hora del partido usando Luxon.
    // Se asume que game.date es una cadena ISO en UTC.
    const startChicago = DateTime.fromISO(game.date, { zone: 'utc' }).setZone('America/Chicago');
    // Los partidos de NFL suelen durar alrededor de 3 horas.
    const endChicago = startChicago.plus({ hours: 3 });

    // Formateamos el objeto para Google Calendar con el offset correcto.
    const calendarEvent = {
        summary: title,
        description,
        start: {
            dateTime: startChicago.toISO(), // Ejemplo: "2025-02-08T18:00:00-06:00"
            timeZone: 'America/Chicago'
        },
        end: {
            dateTime: endChicago.toISO(),   // Ejemplo: "2025-02-08T21:00:00-06:00"
            timeZone: 'America/Chicago'
        }
    };

    return calendarEvent;
};

/**
 * Función auxiliar que, dado el scoreboard completo, filtra y mapea los partidos de los Kansas City Chiefs.
 * @param {Object} scoreboardData - Objeto obtenido del endpoint de scoreboard.
 * @returns {Array} Array de eventos listos para enviar a Google Calendar.
 */
export const getChiefsCalendarEvents = (scoreboardData) => {
    const events = scoreboardData.events || [];
    const chiefsGames = filterChiefsGames(events);
    const calendarEvents = chiefsGames.map(mapGameToCalendarEvent);
    return calendarEvents;
};
