import { z } from 'zod';

/**
 * Schema Zod para criação de um contato
 * Valida os dados de entrada antes de processar
 */
export const createContactsSchema = z.object({
  peopleId: z
    .string({
      required_error: 'ID da pessoa é obrigatório',
      invalid_type_error: 'ID da pessoa deve ser uma string',
    })
    .min(1, 'ID da pessoa não pode estar vazio'),
  type: z
    .string({
      required_error: 'Tipo de contato é obrigatório',
      invalid_type_error: 'Tipo de contato deve ser uma string',
    })
    .min(2, 'Tipo de contato deve ter pelo menos 2 caracteres')
    .max(50, 'Tipo de contato deve ter no máximo 50 caracteres'),
  value: z
    .string({
      required_error: 'Valor do contato é obrigatório',
      invalid_type_error: 'Valor do contato deve ser uma string',
    })
    .min(3, 'Valor do contato deve ter pelo menos 3 caracteres')
    .max(255, 'Valor do contato deve ter no máximo 255 caracteres'),
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type CreateContactsDto = z.infer<typeof createContactsSchema>;

