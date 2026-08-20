import { Router } from 'express';
import * as eventController from '../controllers/eventController';
import { validateRequest } from '../middleware/validator';
import { authenticate } from '../middleware/auth';
import { mutationLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes (just getting events)
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

// Protected routes (require auth)
router.post(
  '/', 
  authenticate, 
  mutationLimiter, 
  validateRequest(eventController.createEventSchema), 
  eventController.createEvent
);

router.put(
  '/:id', 
  authenticate, 
  mutationLimiter, 
  validateRequest(eventController.updateEventSchema), 
  eventController.updateEvent
);

router.delete(
  '/:id', 
  authenticate, 
  mutationLimiter, 
  eventController.deleteEvent
);

export default router;
