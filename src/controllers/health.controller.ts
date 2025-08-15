import { Request, Response } from 'express';

export const health = (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'OK',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  });
};
