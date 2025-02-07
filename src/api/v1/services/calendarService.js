import { google } from "googleapis";
import { googleConfig } from "../config/googleConfig.js";

const oauth2Client = new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirectUri
);

// Config el refresh token para mantener la sesión activa
oauth2Client.setCredentials({
    refresh_token: googleConfig.googleRefreshToken
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

/**
 * Crear un evento en Google Calendar
 * @param {Object} eventData - Datos del evento
 * @returns {Promise<Object>} La respuesta de la API de Google Calendar
 */
export const createCalendarEvent = async (eventData) => {
    try {
        const responseCalendar = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: eventData,
        });
        return responseCalendar.data;
    } catch (error) {
        console.error('Error al crear el evento en Google Calendar:', error);
        throw error;
    }
};