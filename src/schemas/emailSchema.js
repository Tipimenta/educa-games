import { z } from 'zod';

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'E-mail é obrigatório')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'E-mail inválido'),
});
