import cron from 'node-cron';
import axios from 'axios';
import { endpointsConfig } from '../config/endpointsConfig.js';
import { listCalendarEvents } from '../services/calendarService.js';

export const scheduleDailySync = () => {
    cron.schedule('* * * * *', async () => {
      console.log('Ejecutando sincronización diaria de eventos deportivos...');
      try {
        for (const config of endpointsConfig) {
          try {
            // Consultamos el endpoint GET para obtener los eventos mapeados
            const getResponse = await axios.get(config.getUrl);
            const events = getResponse.data.events;
            if (!events || events.length === 0) {
              console.log(`No se encontraron eventos en ${config.getUrl}`);
              continue;
            }
            // Iteramos sobre cada evento obtenido
            for (const event of events) {
              // Usamos listCalendarEvents para verificar si el evento ya existe
              const duplicate = await listCalendarEvents(
                event.start.dateTime,
                event.end.dateTime,
                event.summary
              );
              if (duplicate.items && duplicate.items.length > 0) {
                console.log(`El evento "${event.summary}" ya existe. Se omite su creación.`);
              } else {
                // Si no existe, llamamos al endpoint POST para crear el evento
                const postResponse = await axios.post(config.postUrl);
                console.log(`Evento "${event.summary}" creado:`, postResponse.data.calendarResponse.id);
              }
            }
          } catch (err) {
            console.error(`Error sincronizando ${config.getUrl}:`, err.message);
          }
        }
        console.log('Sincronización diaria finalizada.');
      } catch (error) {
        console.error('Error general en la sincronización:', error.message);
      }
    });
  };