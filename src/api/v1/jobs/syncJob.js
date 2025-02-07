import cron from 'node-cron';
import axios from 'axios';

// Definir un arreglo con las URL de los servicios a sincronizar.
const endpoints = [
    'http://localhost:3000/v1/calendar/lakers',
    'http://localhost:3000/v1/calendar/hornets',
    'http://localhost:3000/v1/calendar/inter-miami',
    'http://localhost:3000/v1/calendar/kansas-city-chief',
    'http://localhost:3000/v1/calendar/boston-red-sox',
    'http://localhost:3000/v1/calendar/los-angeles-dodgers',
    'http://localhost:3000/v1/calendar/barcelona',
]

// Programa la tarea para que se ejecute cada hora.
export const scheduleDailySync = () => {
    cron.schedule('*/30 * * * *', async () => {
        console.log('Ejecutando sincronización de eventos deportivos...');
        try {
            const requests = endpoints.map((endpoint) => axios.post(endpoint));
            const responses = await Promise.all(requests);
            responses.forEach((response, index) => {
                console.log(`Sincronización completada en ${endpoints[index]}:`, response.data);
            })
        } catch (error) {
            console.error('Error en alguna de las peticiones:', error.message);
        }
    });
}