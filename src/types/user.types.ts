export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  isVerified: boolean;
  lastLogin: Date;
  inactivityThresholdDays: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  phone?: string;
  isVerified?: boolean;
  inactivityThresholdDays?: number;
}