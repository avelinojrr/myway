import express from 'express';
import sportsRoutes from './src/api/v1/routes/sportsRoutes.js';

import './src/api/v1/jobs/syncJob.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/v1', sportsRoutes);

app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
});

export default app;
