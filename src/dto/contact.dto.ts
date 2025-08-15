import { z } from 'zod';

export const createContactDto = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    role: z.string().min(1),
  }),
});

export const updateContactDto = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    role: z.string().optional(),
    verified: z.boolean().optional(),
  }),
});

export const getContactsQueryDto = z.object({
  query: z.object({
    pageSize: z.string().transform(Number).default('10').optional(),
    pageNumber: z.string().transform(Number).default('1').optional(),
    user_id: z.string().optional(),
    role: z.string().optional(),
    verified: z.string().transform((v) => v === 'true').optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    search: z.string().optional(),
  }),
}); 