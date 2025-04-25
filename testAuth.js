import { getAuthenticatedClient } from './src/api/v1/services/googleAuthService.js';
import { google } from 'googleapis';

async function testAuth() {
    try {
        console.log('Obteniendo cliente autenticado...');
        const auth = await getAuthenticatedClient();
        
        console.log('Obteniendo información del token...');
        const tokenInfo = await auth.getTokenInfo(auth.credentials.access_token);
        
        console.log('Token válido:', !!tokenInfo);
        console.log('Fecha de expiración:', new Date(auth.credentials.expiry_date).toLocaleString());
        console.log('Tiempo restante:', Math.round((auth.credentials.expiry_date - Date.now()) / 1000 / 60), 'minutos');
        
        // Probar el cliente del calendario
        const calendar = google.calendar({ version: 'v3', auth });
        
        console.log('Consultando eventos del calendario...');
        const events = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });
        
        console.log(`Eventos próximos encontrados: ${events.data.items.length}`);
        
        // Forzar actualización del token para probar la renovación
        console.log('Forzando actualización del token...');
        const { credentials } = await auth.refreshAccessToken();
        console.log('Nuevo token obtenido:', !!credentials.access_token);
        console.log('Nueva fecha de expiración:', new Date(credentials.expiry_date).toLocaleString());
        
        console.log('¡Prueba completada con éxito!');
    } catch (error) {
        console.error('Error en la prueba de autenticación:', error);
    }
}

testAuth();