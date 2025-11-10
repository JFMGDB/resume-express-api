import { z } from 'zod';

/**
 * Schema Zod para atualização de uma pessoa
 * Todos os campos são opcionais para permitir atualizações parciais
 */
export const updatePersonSchema = z.object({
  full_name: z
    .string({
      invalid_type_error: 'Nome completo deve ser uma string',
    })
    .min(3, 'Nome completo deve ter pelo menos 3 caracteres')
    .max(255, 'Nome completo deve ter no máximo 255 caracteres')
    .optional(),
  headline: z
    .string({
      invalid_type_error: 'Headline deve ser uma string',
    })
    .min(3, 'Headline deve ter pelo menos 3 caracteres')
    .max(255, 'Headline deve ter no máximo 255 caracteres')
    .optional(),
  summary: z
    .string({
      invalid_type_error: 'Resumo deve ser uma string',
    })
    .min(10, 'Resumo deve ter pelo menos 10 caracteres')
    .optional(),
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
export type UpdatePersonDto = z.infer<typeof updatePersonSchema>;

