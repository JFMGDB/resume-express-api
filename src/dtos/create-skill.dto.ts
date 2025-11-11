import { z } from 'zod';

/**
 * Schema Zod para criação de uma skill
 * Valida os dados de entrada antes de processar
 */
export const createSkillSchema = z.object({
  name: z
    .string({
      required_error: 'Nome da skill é obrigatório',
      invalid_type_error: 'Nome da skill deve ser uma string',
    })
    .min(2, 'Nome da skill deve ter pelo menos 2 caracteres')
    .max(255, 'Nome da skill deve ter no máximo 255 caracteres')
    .trim(),
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type CreateSkillDto = z.infer<typeof createSkillSchema>;

