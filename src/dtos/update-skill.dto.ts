import { z } from 'zod';

/**
 * Schema Zod para atualização de uma skill
 * Todos os campos são opcionais para permitir atualizações parciais
 */
export const updateSkillSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Nome da skill deve ser uma string',
    })
    .min(2, 'Nome da skill deve ter pelo menos 2 caracteres')
    .max(255, 'Nome da skill deve ter no máximo 255 caracteres')
    .trim()
    .optional(),
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type UpdateSkillDto = z.infer<typeof updateSkillSchema>;

