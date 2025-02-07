import { Router } from "express";
import { createBarcelonaCalendarEvent } from "../controllers/barcelonaCalendarController.js";

const router = Router();

// Endpoint para crear el evento del Barcelona en Google Calendar
router.post('/barcelona', createBarcelonaCalendarEvent);

export default router;