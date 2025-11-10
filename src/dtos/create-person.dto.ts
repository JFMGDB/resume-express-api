import { z } from 'zod';

/**
 * Schema Zod para criação de uma pessoa
 * Valida os dados de entrada antes de processar
 */
export const createPersonSchema = z.object({
  full_name: z
    .string({
      required_error: 'Nome completo é obrigatório',
      invalid_type_error: 'Nome completo deve ser uma string',
    })
    .min(3, 'Nome completo deve ter pelo menos 3 caracteres')
    .max(255, 'Nome completo deve ter no máximo 255 caracteres'),
  headline: z
    .string({
      required_error: 'Headline é obrigatório',
      invalid_type_error: 'Headline deve ser uma string',
    })
    .min(3, 'Headline deve ter pelo menos 3 caracteres')
    .max(255, 'Headline deve ter no máximo 255 caracteres'),
  summary: z
    .string({
      required_error: 'Resumo é obrigatório',
      invalid_type_error: 'Resumo deve ser uma string',
    })
    .min(10, 'Resumo deve ter pelo menos 10 caracteres'),
  location: z
    .string({
      invalid_type_error: 'Localização deve ser uma string',
    })
    .max(255, 'Localização deve ter no máximo 255 caracteres')
    .optional(),
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type CreatePersonDto = z.infer<typeof createPersonSchema>;

