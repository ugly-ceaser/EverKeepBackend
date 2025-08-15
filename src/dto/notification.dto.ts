import { z } from 'zod';

export const getNotificationsQueryDto = z.object({
  query: z.object({
    pageSize: z.string().transform(Number).default('10').optional(),
    pageNumber: z.string().transform(Number).default('1').optional(),
    user_id: z.string().optional(),
    title: z.string().optional(),
    content: z.string().optional(),
  }),
});

export const createNotificationDto = z.object({
  body: z.object({
    user_id: z.string(),
    title: z.string().min(1),
    content: z.string().min(1),
  }),
});

export const countQueryDto = z.object({
  query: z.object({
    user_id: z.string(),
  }),
}); 