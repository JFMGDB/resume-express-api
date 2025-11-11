import { z } from 'zod';

/**
 * Schema Zod para validação de parâmetros de rota (ID)
 */
export const certificationsParamsSchema = z.object({
  id: z
    .string({
      required_error: 'ID é obrigatório',
      invalid_type_error: 'ID deve ser uma string',
    })
    .min(1, 'ID não pode estar vazio'),
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type CertificationsParamsDto = z.infer<typeof certificationsParamsSchema>;

