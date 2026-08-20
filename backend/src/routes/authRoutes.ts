import { Router } from 'express';
import { register, login, getMe, registerSchema, loginSchema } from '../controllers/authController';
import { validateRequest } from '../middleware/validator';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply strict rate limiting to auth routes
router.use('/register', authLimiter);
router.use('/login', authLimiter);

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/me', authenticate, getMe);

export default router;
