import { z } from 'zod';

import { getPlainText } from '../utils/text';
import { getYouTubeId } from '../utils/youtube';

export const lessonTitleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(120, 'Título deve ter no máximo 120 caracteres'),
});

export const lessonPointsSchema = z.object({
  points: z
    .number({ required_error: 'Pontos da aula são obrigatórios' })
    .int('Pontos devem ser um número inteiro')
    .min(0, 'Pontos não podem ser negativos')
    .max(10000, 'Limite de pontos excedido'),
});

export const lessonContentSchema = z.object({
  description: z
    .string()
    .optional()
    .refine(
      (html) => {
        const plain = getPlainText(html || '');
        return plain.length <= 10000;
      },
      { message: 'Conteúdo deve ter no máximo 10.000 caracteres' }
    ),
});

export const youtubeUrlSchema = z.object({
  youtubeUrl: z
    .string()
    .optional()
    .refine((url) => !url || !!getYouTubeId(url), { message: 'URL inválida' }),
});
