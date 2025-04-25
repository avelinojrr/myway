import { google } from 'googleapis';
import { googleConfig } from '../config/googleConfig.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta para almanecenar localmente el token
const TOKEN_PATH = path.join(__dirname, '../../../..', 'tokens.json');

/**
 * Crea el cliente OAuth2 de Google
 * @returns {OAuth2Client} Cliente OAuth2 de Google
 */
export const createOAuth2Client = () => {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirectUri
    );
};

/**
 * Guarda los tokens en un archivo local
 * @param {Object} token - Tokens de acceso y actualización
 */
export const saveTokens = (token) => {
    try {
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        console.log('Tokens guardados en:', TOKEN_PATH);
    } catch (error) {
        console.error('Error al guardar tokens:', error);
    }
};

/**
 * Lee los tokens desde el archivo local
 * @returns {Object|null} - Tokens o null si no existe el archivo
 */
export const loadTokens = () => {
    try {
        if (fs.existsSync(TOKEN_PATH)) {
            const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
            return tokens;
        }
        return null;
    } catch (error) {
        console.error('Error al cargar tokens:', error);
        return null;
    }
};

/**
 * Obtiene un cliente OAuth2 autenticado con manejo automático de renovación de tokens
 * @returns {Promise<OAuth2Client>} - Cliente OAuth2 autenticado
 */
export const getAuthenticatedClient = async () => {
    const oauth2Client = createOAuth2Client();
    
    // Intenta cargar tokens desde el archivo
    const savedTokens = loadTokens();
    
    if (savedTokens) {
        // Configura los tokens en el cliente
        oauth2Client.setCredentials(savedTokens);
        
        // Configuramos el evento para guardar automáticamente los tokens cuando se refresquen
        oauth2Client.on('tokens', (tokens) => {
            // Si recibimos nuevos tokens, los combinamos con los existentes
            const updatedTokens = { ...savedTokens, ...tokens };
            saveTokens(updatedTokens);
            console.log('Tokens refrescados automáticamente');
        });
    } else {
        // Si no hay tokens guardados, usamos el refresh_token del .env
        oauth2Client.setCredentials({
            refresh_token: googleConfig.googleRefreshToken
        });
        
        // Forzamos una renovación inicial para obtener un access_token válido
        try {
            const { credentials } = await oauth2Client.refreshAccessToken();
            saveTokens(credentials);
            oauth2Client.setCredentials(credentials);
            
            // Configuramos el evento para guardar automáticamente los tokens cuando se refresquen
            oauth2Client.on('tokens', (tokens) => {
                const updatedTokens = { ...credentials, ...tokens };
                saveTokens(updatedTokens);
                console.log('Tokens refrescados automáticamente');
            });
        } catch (error) {
            console.error('Error al refrescar el token inicial:', error);
            throw error;
        }
    }
    
    return oauth2Client;
};