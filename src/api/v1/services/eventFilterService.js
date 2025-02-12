// src/api/v1/services/eventFilterService.js
import { DateTime } from "luxon";

/**
 * Filtra y extrae los eventos relevantes de un equipo o liga.
 * @param {Object} scoreboardData - Datos del scoreboard obtenidos de ESPN.
 * @param {string} team - Nombre o identificador del equipo.
 * @returns {Array} - Lista de eventos filtrados.
 */
export const getCalendarEventsByTeam = (scoreboardData, team) => {
    if (!scoreboardData || !scoreboardData.events) {
        console.log("⚠️ No hay eventos en el scoreboard.");
        return [];
    }

    // Si el parámetro es "champions" o "f1", devolvemos todos los eventos sin filtrar.
    let filteredEvents = scoreboardData.events;
    if (team.toLowerCase() !== "champions" && team.toLowerCase() !== "f1") {
        filteredEvents = scoreboardData.events.filter((event) => {
            // Verificamos que el partido tenga información en competitions
            if (!event.competitions || !event.competitions[0]) return false;
            const competitors = event.competitions[0].competitors || [];
            return competitors.some((comp) =>
                comp.team.shortDisplayName.toLowerCase().includes(team.toLowerCase())
            );
        });
    }

    // Mapeamos los eventos filtrados
    return filteredEvents.map((event) => {
        // Si existen competiciones y se definen los competidores, usamos el mapeo típico
        if (event.competitions && event.competitions[0]) {
            const competitors = event.competitions[0].competitors || [];
            const startDate = DateTime.fromISO(event.date).toUTC();
            const endDate = startDate.plus({ hours: 2 }); // Se asume que un partido dura 2 horas
            return {
                summary: event.name,
                start: { dateTime: startDate.toISO() },
                end: { dateTime: endDate.toISO() },
                location: event.venue ? event.venue.fullName : "Por definir",
                description: `Partido entre ${competitors.map((comp) => comp.team.displayName).join(" vs ")}.`,
                link: (event.links && Array.isArray(event.links) && event.links.length > 0)
                    ? event.links.find((link) => link.rel && link.rel.includes("summary"))?.href || null
                    : null,
                // Se conserva cualquier otra propiedad, por ejemplo, extendedProperties se agregará en el servicio de calendar.
            };
        } else {
            // Caso F1 u otros eventos sin "competitions"
            const startDate = DateTime.fromISO(event.date).toUTC();
            const endDate = startDate.plus({ hours: 2 }); // Ajusta la duración según corresponda
            return {
                summary: event.name || "F1 Race",
                start: { dateTime: startDate.toISO() },
                end: { dateTime: endDate.toISO() },
                location: event.venue ? event.venue.fullName : "Por definir",
                description: event.description || "F1 Race",
                link: (event.links && Array.isArray(event.links) && event.links.length > 0)
                    ? event.links[0].href
                    : null,
            };
        }
    });
};
