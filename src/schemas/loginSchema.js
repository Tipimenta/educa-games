import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'E-mail é obrigatório')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'E-mail inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .max(128, 'Senha deve ter no máximo 128 caracteres'),
});
