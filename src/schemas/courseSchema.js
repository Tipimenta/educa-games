import { z } from 'zod';

export const courseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Título deve ter pelo menos 2 caracteres')
    .max(120, 'Título deve ter no máximo 120 caracteres'),
  description: z
    .string()
    .trim()
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
});