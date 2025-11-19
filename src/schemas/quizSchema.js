import { z } from 'zod';

export const quizQuestionTextSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Pergunta não pode ser vazia')
    .max(400, 'Pergunta deve ter no máximo 400 caracteres'),
});

export const quizOptionSchema = z.object({
  option: z
    .string()
    .trim()
    .min(1, 'Alternativa não pode ser vazia')
    .max(200, 'Alternativa deve ter no máximo 200 caracteres'),
});

export const quizPointsSchema = z.object({
  points: z
    .number({ required_error: 'Pontos da aula são obrigatórios' })
    .int('Pontos devem ser um número inteiro')
    .min(0, 'Pontos não podem ser negativos')
    .max(10000, 'Limite de pontos excedido'),
});

export const quizQuestionSchema = z
  .object({
    text: z
      .string()
      .trim()
      .min(1, 'O texto da questão é obrigatório')
      .max(400, 'O texto da questão deve ter no máximo 400 caracteres'),
    options: z
      .array(z.string())
      .min(2, 'Cada pergunta precisa de pelo menos 2 alternativas')
      .refine(
        (options) => {
          const nonEmpty = options.map((o) => (o || '').trim()).filter((o) => o.length > 0);
          return nonEmpty.length >= 2;
        },
        {
          message: 'Cada pergunta precisa de pelo menos 2 alternativas não vazias',
        }
      )
      .refine(
        (options) => {
          return !options.some((o) => (o || '').trim().length === 0);
        },
        {
          message: 'Não é permitido ter alternativas vazias',
        }
      ),
    points: z
      .number({ required_error: 'Os pontos são obrigatórios' })
      .int('Os pontos devem ser um número inteiro')
      .min(0, 'Os pontos devem ser no mínimo 0')
      .max(10000, 'Os pontos devem ser no máximo 10000'),
    correctAnswer: z
      .string()
      .max(200, 'A resposta correta deve ter no máximo 200 caracteres')
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.correctAnswer) return true;
      const nonEmptyOptions = data.options.map((o) => (o || '').trim()).filter((o) => o.length > 0);
      return nonEmptyOptions.includes(data.correctAnswer.trim());
    },
    {
      message: 'A resposta correta deve corresponder a uma das alternativas',
      path: ['correctAnswer'],
    }
  );

export const quizSchema = z.object({
  questions: z.array(quizQuestionSchema).min(1, 'O quiz deve ter pelo menos uma pergunta'),
});
