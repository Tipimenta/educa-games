import { z } from 'zod';

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(120, 'Nome deve ter no máximo 120 caracteres')
    .regex(/^[\p{L}\p{M}\s'-]+$/u, 'Nome não pode conter números ou símbolos especiais')
    .refine((val) => val.split(/\s+/).filter(Boolean).length >= 2, {
      message: 'Digite seu nome e sobrenome',
    }),

  birthDate: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // opcional
        const today = new Date();
        const date = new Date(val);
        if (Number.isNaN(date.getTime())) return false;
        const isTodayOrFuture =
          date >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (isTodayOrFuture) return false;
        const ageYears =
          today.getFullYear() -
          date.getFullYear() -
          (today < new Date(today.getFullYear(), date.getMonth(), date.getDate()) ? 1 : 0);
        return ageYears <= 120;
      },
      {
        message: 'Data de nascimento inválida',
      }
    ),

  description: z.string().optional(),
});
