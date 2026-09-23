import { Router } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  toggleBookmarkPost,
  getTrendingTags,
  getPostComments,
  addPostComment,
} from '../controllers/postController.js';
import { protect, attachUserIfPresent } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { createPostSchema, updatePostSchema, createCommentSchema } from '../validators/postValidators.js';

const router = Router();

router.get('/trending/tags', getTrendingTags);
router.get('/', attachUserIfPresent, getPosts);
router.post('/', protect, validate(createPostSchema), createPost);

router.get('/:id', attachUserIfPresent, getPostById);
router.patch('/:id', protect, validate(updatePostSchema), updatePost);
router.delete('/:id', protect, deletePost);

router.post('/:id/like', protect, toggleLikePost);
router.post('/:id/bookmark', protect, toggleBookmarkPost);

router.get('/:id/comments', getPostComments);
router.post('/:id/comments', protect, validate(createCommentSchema), addPostComment);

export default router;
