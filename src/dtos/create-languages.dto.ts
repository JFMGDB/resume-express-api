import { z } from 'zod';

/**
 * Schema Zod para criação de um idioma
 * Valida os dados de entrada antes de processar
 */
export const createLanguagesSchema = z.object({
  peopleId: z
    .string({
      required_error: 'ID da pessoa é obrigatório',
      invalid_type_error: 'ID da pessoa deve ser uma string',
    })
    .min(1, 'ID da pessoa não pode estar vazio'),
  name: z
    .string({
      required_error: 'Nome do idioma é obrigatório',
      invalid_type_error: 'Nome do idioma deve ser uma string',
    })
    .min(2, 'Nome do idioma deve ter pelo menos 2 caracteres')
    .max(100, 'Nome do idioma deve ter no máximo 100 caracteres'),
  proficiency: z
    .string({
      required_error: 'Proficiência é obrigatória',
      invalid_type_error: 'Proficiência deve ser uma string',
    })
    .min(2, 'Proficiência deve ter pelo menos 2 caracteres')
    .max(50, 'Proficiência deve ter no máximo 50 caracteres'),
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type CreateLanguagesDto = z.infer<typeof createLanguagesSchema>;

