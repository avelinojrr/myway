import { google } from 'googleapis';
import crypto from 'crypto';
import { getAuthenticatedClient } from './googleAuthService.js';

// Variable para almacenar la instancia del cliente del calendario
let calendarInstance = null;

/**
 * Obtiene o crea una instancia del cliente de Google Calendar.
 * @returns {Promise<Calendar>} - Instancia del cliente de Google Calendar.
 */
export const getCalendarClient = async () => {
    if (calendarInstance) {
        return calendarInstance;
    }

    try {
        // Obtener un cliente OAtuh2 autenticado con manejo automático de renovación de tokens
        const auth = await getAuthenticatedClient();
        calendarInstance = google.calendar({ version: 'v3', auth });
        return calendarInstance;
    } catch (error) {
        console.error('Error al obtener el cliente de Google Calendar:', error);
        throw error;
    }
};

/**
 * Genera un identificador único para el evento basado en su resumen y fecha de inicio.
 * @param {Object} eventData - Datos del evento.
 * @returns {string} Identificador único (hash MD5).
 */
const generateUniqueId = (eventData) => {
    return crypto.createHash('md5')
        .update(`${eventData.summary}-${eventData.start.dateTime}`)
        .digest('hex');
};

/**
 * Crea un evento en Google Calendar, incluyendo una propiedad extendida para evitar duplicados.
 * Se agrega en extendedProperties.private.customEventId el ID único generado.
 * @param {Object} eventData - Datos del evento.
 * @returns {Promise<Object>} La respuesta de la API de Google Calendar.
 */
export const createCalendarEvent = async (eventData) => {
    try {
        // Genera un ID único para el evento
        const uniqueId = generateUniqueId(eventData);
        // Asegura que exista el objeto extendedProperties y agrega la propiedad personalizada
        eventData.extendedProperties = eventData.extendedProperties || { private: {} };
        eventData.extendedProperties.private.customEventId = uniqueId;

        // Obtener cliente de calendar con tokens actualizados
        const calendar = await getCalendarClient();
        
        const responseCalendar = await calendar.events.insert({
            calendarId: "primary",
            requestBody: eventData,
        });
        return responseCalendar.data;
    } catch (error) {
        console.error("Error al crear el evento en Google Calendar:", error);
        throw error;
    }
};

/**
 * Lista eventos en el calendario dentro de un rango de tiempo, filtrando por una propiedad extendida personalizada.
 * @param {string} timeMin - Fecha/hora mínima (ISO).
 * @param {string} timeMax - Fecha/hora máxima (ISO).
 * @param {string} extendedPropertyQuery - (Opcional) Por ejemplo: "customEventId=XXXX".
 * @returns {Promise<Object>} Datos de la lista de eventos.
 */
export const listCalendarEvents = async (timeMin, timeMax, extendedPropertyQuery = "") => {
    try {
        const params = {
            calendarId: "primary",
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: "startTime",
        };

        if (extendedPropertyQuery) {
            params.privateExtendedProperty = extendedPropertyQuery;
        }

        // Obtener cliente de calendar con tokens actualizados
        const calendar = await getCalendarClient();
        
        const response = await calendar.events.list(params);
        return response.data;
    } catch (error) {
        console.error("Error al listar los eventos en Google Calendar:", error);
        throw error;
    }
};