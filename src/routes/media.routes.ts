import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { uploadMedia, deleteMedia, uploadMiddleware, proxyDownload, signedDownload } from '../controllers/media.controller';

const router = Router();

router.post('/upload', authMiddleware, uploadMiddleware, uploadMedia);
router.delete('/:publicId', authMiddleware, deleteMedia);
router.get('/download', authMiddleware, proxyDownload);
router.get('/download/signed', authMiddleware, signedDownload);

export default router; 