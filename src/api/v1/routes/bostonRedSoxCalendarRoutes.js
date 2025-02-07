import { Router } from 'express';
import { createRedSoxCalendarEvent } from '../controllers/bostonRedSoxCalendarController.js';

const router = Router();

router.post('/boston-red-sox', createRedSoxCalendarEvent);

export default router;
