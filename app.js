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

// Middleware para manejar errores globales
app.use((err, req, res, next) => {
    console.error('Error global:', err.message);
    res.status(500).json({
        message: 'Error en el servidor',
        error: process.env.NODE_ENV === 'production' ? 'Error interno' : err.message
    });
});

export default app;
