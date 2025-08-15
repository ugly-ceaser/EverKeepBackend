import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { userRepository } from '../repositories/user.repository';

const toApi = (u: any) => ({
  id: u.id,
  email: u.email,
  phone: u.phone,
  is_verified: u.isVerified,
  full_name: u.fullName,
  last_login: u.lastLogin,
  inactivity_threshold_days: u.inactivityThresholdDays,
  created_at: u.createdAt,
  updated_at: u.updatedAt,
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const user = await userRepository.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.status(200).json({
    success: true,
    message: 'User retrieved successfully',
    data: toApi(user),
    timestamp: new Date().toISOString(),
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { full_name, phone, inactivity_threshold_days } = req.body as {
    full_name?: string;
    phone?: string;
    inactivity_threshold_days?: number;
  };

  const updateData: any = {};
  if (typeof full_name === 'string') updateData.fullName = full_name;
  if (typeof phone === 'string') updateData.phone = phone;
  if (typeof inactivity_threshold_days === 'number') updateData.inactivityThresholdDays = inactivity_threshold_days;

  const user = await userRepository.update(id, updateData);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: toApi(user),
    timestamp: new Date().toISOString(),
  });
}); 