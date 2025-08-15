import { z } from 'zod';

export const loginDto = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const registerDto = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    fullName: z.string().min(1, 'Full name is required'),
    phone: z.string().min(1, 'Phone is required'),
  }),
});

export const requestEmailVerificationDto = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const verifyEmailDto = z.object({
  body: z.object({ token: z.string().min(10) }),
});

export const requestPasswordResetDto = z.object({
  body: z.object({ email: z.string().email() }),
});

export const resetPasswordDto = z.object({
  body: z.object({ token: z.string().min(10), newPassword: z.string().min(8) }),
});

export type LoginDto = z.infer<typeof loginDto>;
export type RegisterDto = z.infer<typeof registerDto>;