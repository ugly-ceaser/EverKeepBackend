import { Request } from 'express';

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    phone: string;
  };
  token: string;
}