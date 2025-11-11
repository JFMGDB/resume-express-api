import { z } from 'zod';

/**
 * Schema Zod para atualização de um contato
 * Todos os campos são opcionais para permitir atualizações parciais
 */
export const updateContactsSchema = z.object({
  type: z
    .string({
      invalid_type_error: 'Tipo de contato deve ser uma string',
    })
    .min(2, 'Tipo de contato deve ter pelo menos 2 caracteres')
    .max(50, 'Tipo de contato deve ter no máximo 50 caracteres')
    .optional(),
  value: z
    .string({
      invalid_type_error: 'Valor do contato deve ser uma string',
    })
    .min(3, 'Valor do contato deve ter pelo menos 3 caracteres')
    .max(255, 'Valor do contato deve ter no máximo 255 caracteres')
    .optional(),
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type UpdateContactsDto = z.infer<typeof updateContactsSchema>;

