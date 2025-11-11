import { z } from 'zod';

/**
 * Schema Zod para validação de parâmetros de rota (ID)
 */
export const contactsParamsSchema = z.object({
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
export type ContactsParamsDto = z.infer<typeof contactsParamsSchema>;

