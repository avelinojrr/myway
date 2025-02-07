import { DateTime } from 'luxon';

/**
 * Filtra los partidos en los que aparece el Inter de Miami.
 * @param {Array} events - Array de partidos obtenido del scoreboard.
 * @returns {Array} Array filtrado de partidos donde participa el Inter de Miami.
 */
export const filterInterMiamiGames = (events) => {
    return events.filter((game) => {
        // Verificamos que el partido tenga información de competencias
        if (!game.competitions || !game.competitions[0]) return false;
        const competitors = game.competitions[0].competitors;
        // Imprimimos en consola los nombres para verificar
        console.log('Competitors:', competitors.map(c => c.team.shortDisplayName));
        // Filtramos si alguno de los equipos contiene "miami"
        // Puedes ajustar la condición según el formato de la respuesta; por ejemplo,
        // a veces el equipo se identifica como "Inter Miami" o simplemente "Miami".
        return competitors.some((competitor) =>
            competitor.team.shortDisplayName.toLowerCase().includes('miami')
        );
    });
};

/**
 * Mapea la información de un partido del Inter de Miami al formato de evento para Google Calendar.
 * @param {Object} game - Objeto del partido.
 * @returns {Object} Objeto formateado para ser usado en Google Calendar.
 */
export const mapGameToCalendarEvent = (game) => {
    const competition = game.competitions[0];
    const competitors = competition.competitors;

    // Identificamos al equipo Inter de Miami y al oponente.
    // Se asume que el equipo Inter de Miami tiene "miami" en su shortDisplayName.
    const interMiamiCompetitor = competitors.find((comp) =>
        comp.team.shortDisplayName.toLowerCase().includes('miami')
    );
    const opponentCompetitor = competitors.find((comp) =>
        !comp.team.shortDisplayName.toLowerCase().includes('miami')
    );

    if (!interMiamiCompetitor || !opponentCompetitor) {
        throw new Error('No se pudo identificar correctamente a los equipos del partido.');
    }

    // Construir el título y la descripción del evento.
    const title = `${interMiamiCompetitor.team.name} vs ${opponentCompetitor.team.name}`;
    const description = `Partido de la MLS entre ${interMiamiCompetitor.team.name} y ${opponentCompetitor.team.name} en ${competition.venue?.fullName || 'lugar no definido'}.`;

    // Convertimos la fecha/hora del partido usando Luxon.
    // Se asume que game.date es una cadena ISO en UTC.
    const startLocal = DateTime.fromISO(game.date, { zone: 'utc' }).setZone('America/New_York');
    // Aunque en fútbol suelen durar 90 minutos, puedes ajustar la duración si lo prefieres.
    // Aquí asumimos 2 horas (120 minutos) para incluir tiempo extra, calentamiento o simplemente para fines de prueba.
    const endLocal = startLocal.plus({ hours: 2 });

    // Formateamos el objeto para Google Calendar con el offset correcto.
    const calendarEvent = {
        summary: title,
        description,
        start: {
            dateTime: startLocal.toISO(),  // Ejemplo: "2025-03-10T19:00:00-04:00"
            timeZone: 'America/New_York'
        },
        end: {
            dateTime: endLocal.toISO(),    // Ejemplo: "2025-03-10T21:00:00-04:00"
            timeZone: 'America/New_York'
        }
    };

    return calendarEvent;
};

/**
 * Función auxiliar que, dado el scoreboard completo, filtra y mapea los partidos del Inter de Miami.
 * @param {Object} scoreboardData - Objeto obtenido del endpoint de scoreboard.
 * @returns {Array} Array de eventos listos para enviar a Google Calendar.
 */
export const getInterMiamiCalendarEvents = (scoreboardData) => {
    const events = scoreboardData.events || [];
    const interMiamiGames = filterInterMiamiGames(events);
    const calendarEvents = interMiamiGames.map(mapGameToCalendarEvent);
    return calendarEvents;
};
