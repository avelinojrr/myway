import { Router } from 'express';
import { fetchScoreboard, fetchNews, fetchAllTeams, fetchTeam } from '../controllers/espnController.js';

const router = Router();

// Endpoint para obtener el scoreboard de la NBA
router.get('/scoreboard', fetchScoreboard);

// Endpoint para obtener las noticias de la NBA
router.get('/news', fetchNews);

// Endpoint para obtener todos los equipos de la NBA
router.get('/teams', fetchAllTeams);

// Endpoint para obtener un equipo específico, se pasa el slug del equipo en la URL
router.get('/teams/:team', fetchTeam);

export default router;
