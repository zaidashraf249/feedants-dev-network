import { Router } from 'express';
import { getCircles, getCircleById, createCircle, toggleJoinCircle } from '../controllers/circleController.js';
import { protect, attachUserIfPresent } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { createCircleSchema } from '../validators/circleValidators.js';

const router = Router();

router.get('/', attachUserIfPresent, getCircles);
router.get('/:idOrSlug', attachUserIfPresent, getCircleById);
router.post('/', protect, validate(createCircleSchema), createCircle);
router.post('/:id/join', protect, toggleJoinCircle);

export default router;
