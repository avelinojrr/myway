import axios from 'axios';

const BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1';

/**
 * Obtiene el scoreboard de la NBA.
 * @returns {Promise<Object>} Datos del scoreboard.
 */
export const getScoreboard = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/scoreboard`);
        // Ajusta según la estructura real del JSON.
        return response.data;
    } catch (error) {
        console.error('Error al obtener el scoreboard de MLS:', error);
        throw error;
    }
};

/**
 * Obtiene las noticias de la NBA.
 * @returns {Promise<Object>} Datos de las noticias.
 */
export const getNews = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/news`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las noticias de MLS:', error);
        throw error;
    }
};

/**
 * Obtiene todos los equipos de la NBA.
 * @returns {Promise<Object>} Datos de todos los equipos.
 */
export const getAllTeams = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/teams`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los equipos de MLS:', error);
        throw error;
    }
};

/**
 * Obtiene información de un equipo específico.
 * @param {string} teamSlug El identificador o slug del equipo.
 * @returns {Promise<Object>} Datos del equipo.
 */
export const getTeam = async (teamSlug) => {
    try {
        const response = await axios.get(`${BASE_URL}/teams/${teamSlug}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el equipo ${teamSlug} de MLS:`, error);
        throw error;
    }
};
