import axios from 'axios'
import { espnAPIs } from '../api/espnAPIs.js'

/**
 * Obtener el scoreboard segun el deporte indicado
 * @param {string} sport - El deporte del caul se quiere obtener el scoreboard
 * @returns {Promise<Object>} - Datos del scoreboard
 */
export const getScoreboardBySport = async (sport) => {
    try {
        if (!espnAPIs[sport]) {
            throw new Error(`El deporte '${sport}' no está soportado.`);
        }
        
        const response = await axios.get(espnAPIs[sport]);
        
        return response.data;
    } catch (error) {
        console.error(`Error obteniendo scoreboard para ${sport}:`, error.message);
        throw error;
    }
};