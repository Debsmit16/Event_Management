import { Router } from 'express';
import * as participantController from '../controllers/participantController';
import { validateRequest } from '../middleware/validator';
import { authenticate } from '../middleware/auth';
import { mutationLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public route to apply to an event (no auth needed for standard users applying)
router.post(
  '/:eventId/register', 
  mutationLimiter,
  validateRequest(participantController.registerSchema), 
  participantController.applyToEvent
);

// Protected routes (require auth - for event owners)
router.get(
  '/:eventId/participants', 
  authenticate, 
  participantController.getEventParticipants
);

// Note: ID here is the participant ID, not event ID
router.patch(
  '/participants/:id/cancel', 
  authenticate,
  mutationLimiter,
  validateRequest(participantController.cancelSchema), 
  participantController.cancelRegistration
);

export default router;
