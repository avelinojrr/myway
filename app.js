import express from 'express';
import dotenv from 'dotenv';
import espnRoutes from './src/api/v1/routes/espnRoutes.js';
import lakersRoutes from './src/api/v1/routes/lakersRoutes.js';
import lakersCalendarRoutes from './src/api/v1/routes/lakersCalendarRoutes.js';
import barcelonaRoutes from './src/api/v1/routes/barcelonaRoutes.js';
import barcelonaCalendarRoutes from './src/api/v1/routes/barcelonaCalendarRoutes.js';
import hornetsRoutes from './src/api/v1/routes/hornetsRoutes.js';
import hornetsCalendarRoutes from './src/api/v1/routes/hornetsCalendarRoutes.js';
import interMiamiRoutes from './src/api/v1/routes/interMiamiRoutes.js';
import interMiamiCalendarRoutes from './src/api/v1/routes/interMiamiCalendarRoutes.js';
import kansasCityChiefsRoutes from './src/api/v1/routes/kansasCityChiefsRoutes.js';
import kansasCityChiefsCalendarRoutes from './src/api/v1/routes/kansasCityChiefsCalendarRoutes.js';

dotenv.config();

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// ESPN API
app.use('/v1/espn', espnRoutes);

// LAKERS API
app.use('/v1/lakers', lakersRoutes);
app.use('/v1/calendar', lakersCalendarRoutes);

// HORNETS API
app.use('/v1/hornets', hornetsRoutes);
app.use('/v1/calendar', hornetsCalendarRoutes);

// BARCELONA API
app.use('/v1/barcelona', barcelonaRoutes);
app.use('/v1/calendar', barcelonaCalendarRoutes);

// INTER MIAMI API
app.use('/v1/inter-miami', interMiamiRoutes);
app.use('/v1/calendar', interMiamiCalendarRoutes);

// KANSAS CITY CHIEFS API
app.use('/v1/kansas-city-chief', kansasCityChiefsRoutes);
app.use('/v1/calendar', kansasCityChiefsCalendarRoutes);

export default app;
