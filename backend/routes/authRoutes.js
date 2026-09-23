import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../validators/authValidators.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
