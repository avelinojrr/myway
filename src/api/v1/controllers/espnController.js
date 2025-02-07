import {
  getScoreboard,
  getNews,
  getAllTeams,
  getTeam,
} from '../services/espnServiceNBA.js';

/**
 * Controlador para obtener el scoreboard de la NBA.
 */
export const fetchScoreboard = async (req, res) => {
  try {
    const data = await getScoreboard();
    res.status(200).json({ scoreboard: data });
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error al obtener el scoreboard de NBA',
        error: error.message,
      });
  }
};

/**
 * Controlador para obtener las noticias de la NBA.
 */
export const fetchNews = async (req, res) => {
  try {
    const data = await getNews();
    res.status(200).json({ news: data });
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error al obtener las noticias de NBA',
        error: error.message,
      });
  }
};

/**
 * Controlador para obtener todos los equipos de la NBA.
 */
export const fetchAllTeams = async (req, res) => {
  try {
    const data = await getAllTeams();
    res.status(200).json({ teams: data });
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error al obtener los equipos de NBA',
        error: error.message,
      });
  }
};

/**
 * Controlador para obtener un equipo específico de la NBA.
 * Se espera que el parámetro :team en la URL corresponda al slug del equipo.
 */
export const fetchTeam = async (req, res) => {
  try {
    const { team } = req.params;
    const data = await getTeam(team);
    res.status(200).json({ team: data });
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Error al obtener el equipo ${req.params.team}`,
        error: error.message,
      });
  }
};
