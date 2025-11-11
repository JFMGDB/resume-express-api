import { z } from 'zod';

/**
 * Schema Zod para validação de parâmetros de rota (ID)
 */
export const skillParamsSchema = z.object({
  id: z.string({
    required_error: 'ID é obrigatório',
    invalid_type_error: 'ID deve ser uma string',
  }),
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type SkillParamsDto = z.infer<typeof skillParamsSchema>;

