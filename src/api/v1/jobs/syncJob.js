// src/jobs/syncJob.js
import cron from "node-cron";
import { getScoreboardBySport } from "../services/espnService.js";
import { getCalendarEventsByTeam } from "../services/eventFilterService.js";
import { createCalendarEvent, listCalendarEvents } from "../services/calendarService.js";
import crypto from "crypto";

// Mapear deportes a equipos válidos
const sportTeamMapping = {
    nba: ["lakers", "hornets"],
    nfl: ["chiefs"],
    mlb: ["redsox", "dodgers"],
    soccer: ["miami"],
    uefa: ["champions"],
    laliga: ["barcelona"],
    f1: ["f1"],
};

// Función para ejecutar la sincronización
const syncSportsEvents = async () => {
    console.log("⏳ Ejecutando sincronización de eventos deportivos...");
    try {
        for (const sport in sportTeamMapping) {
            const teams = sportTeamMapping[sport];
            if (!teams || teams.length === 0) {
                console.log(`⚠️ No hay equipos definidos para ${sport}.`);
                continue;
            }
            let scoreboardData;
            try {
                scoreboardData = await getScoreboardBySport(sport);
            } catch (err) {
                console.error(`Error obteniendo scoreboard para ${sport}:`, err.message);
                continue;
            }
            for (const team of teams) {
                try {
                    const events = getCalendarEventsByTeam(scoreboardData, team);
                    if (!events || events.length === 0) {
                        console.log(`⚠️ No hay eventos para ${team} en ${sport} hoy.`);
                        continue;
                    }
                    // Itera sobre cada evento obtenido
                    for (const event of events) {
                        // Genera el customEventId usando el resumen y el start del evento
                        const uniqueId = crypto
                            .createHash("md5")
                            .update(`${event.summary}-${event.start.dateTime}`)
                            .digest("hex");

                        // Usa el rango exacto del evento para buscar duplicados
                        const duplicate = await listCalendarEvents(
                            event.start.dateTime,
                            event.end.dateTime,
                            `customEventId=${uniqueId}`
                        );
                        if (duplicate.items && duplicate.items.length > 0) {
                            console.log(`🔄 Evento "${event.summary}" ya existe en Google Calendar. No se agregará.`);
                            continue;
                        }
                        try {
                            const calendarResponse = await createCalendarEvent(event);
                            console.log(`✅ Evento "${event.summary}" creado en Google Calendar con ID: ${calendarResponse.id}`);
                        } catch (postError) {
                            if (postError.message.includes('invalid_grant') || postError.message.includes('token expired')) {
                                console.error(`⚠️ Token error detectado. Los tokens se actualizarán automáticamente en el próximo intento.`);
                            } else {
                                console.error(`⚠️ Error al crear el evento "${event.summary}" para ${team} en ${sport}:`, postError.message);
                            }
                        }
                    }
                } catch (err) {
                    console.error(`❌ Error al obtener eventos para ${team} en ${sport}:`, err.message);
                }
            }
        }
        console.log("✅ Finalizó la sincronización de eventos.");
    } catch (error) {
        console.error("❌ Error general en la sincronización:", error.message);
    }
};

// Programar la tarea para ejecutarse cada 12 horas
cron.schedule("0 */12 * * *", syncSportsEvents);

// Ejecutar una sincronización inmediata al iniciar la aplicación
syncSportsEvents();

export { syncSportsEvents };