import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getUserById, updateUser } from '../controllers/user.controller';

const router = Router();

router.get('/:id', authMiddleware, getUserById);
router.patch('/:id', authMiddleware, updateUser);

export default router; 