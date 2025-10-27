import { z } from 'zod';

export const createCadastroSchema = (isStudent) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(1, 'Nome é obrigatório')
        .min(3, 'Nome deve ter pelo menos 3 caracteres')
        .max(120, 'Nome deve ter no máximo 120 caracteres')
        .regex(/^[\p{L}\p{M}\s'-]+$/u, 'Nome não pode conter números ou símbolos especiais')
        .refine((val) => val.split(/\s+/).filter(Boolean).length >= 2, {
          message: 'Digite seu nome e sobrenome',
        }),

      email: z
        .string()
        .trim()
        .min(1, 'E-mail não foi fornecido')
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'E-mail inválido'),

      password: z
        .string()
        .min(8, 'Senha deve ter pelo menos 8 caracteres')
        .max(128, 'Senha deve ter no máximo 128 caracteres'),

      confirmPassword: z
        .string()
        .min(1, 'Confirme sua senha')
        .max(128, 'Senha deve ter no máximo 128 caracteres'),

      turma: isStudent ? z.string().min(1, 'Selecione uma turma') : z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'As senhas digitadas são diferentes',
      path: ['confirmPassword'],
    });

// Schema padrão para fluxos sem turma obrigatória
export const cadastroSchema = createCadastroSchema(false);
