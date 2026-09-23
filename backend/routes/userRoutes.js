import { Router } from 'express';
import {
  getUserProfile,
  updateMyProfile,
  toggleFollowUser,
  searchUsers,
  getCreators,
} from '../controllers/userController.js';
import { protect, attachUserIfPresent } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { updateProfileSchema } from '../validators/authValidators.js';

const router = Router();

router.get('/search', searchUsers);
router.get('/creators', attachUserIfPresent, getCreators);
router.patch('/me', protect, validate(updateProfileSchema), updateMyProfile);
router.post('/:id/follow', protect, toggleFollowUser);
router.get('/:username', attachUserIfPresent, getUserProfile);

export default router;
