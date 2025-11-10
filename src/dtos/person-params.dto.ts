import { z } from 'zod';

/**
 * Schema Zod para validação do parâmetro ID nas rotas
 */
export const personParamsSchema = z.object({
  id: z.string({
    required_error: 'ID é obrigatório',
    invalid_type_error: 'ID deve ser uma string',
  }),
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type PersonParamsDto = z.infer<typeof personParamsSchema>;

