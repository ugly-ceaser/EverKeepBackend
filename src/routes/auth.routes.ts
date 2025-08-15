import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { loginDto, registerDto, requestEmailVerificationDto, verifyEmailDto, requestPasswordResetDto, resetPasswordDto } from '../dto/auth.dto';
import { authMiddleware } from '../middleware/auth.middleware';
import { strictRateLimiter } from '../middleware/rateLimiter.middleware';
import { login, register, me, logout, requestEmailVerification, verifyEmail, requestPasswordReset, resetPassword } from '../controllers/auth.controller';

const router = Router();

router.post('/register', strictRateLimiter, validate(registerDto), register);
router.post('/login', strictRateLimiter, validate(loginDto), login);
router.get('/me', authMiddleware, me);
router.post('/logout', authMiddleware, logout);

router.post('/email/request', strictRateLimiter, validate(requestEmailVerificationDto), requestEmailVerification);
router.post('/email/verify', strictRateLimiter, validate(verifyEmailDto), verifyEmail);

router.post('/password/request', strictRateLimiter, validate(requestPasswordResetDto), requestPasswordReset);
router.post('/password/reset', strictRateLimiter, validate(resetPasswordDto), resetPassword);

export default router; 