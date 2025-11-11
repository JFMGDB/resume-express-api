import { z } from 'zod';

/**
 * Schema Zod para atualização de um idioma
 * Todos os campos são opcionais para permitir atualizações parciais
 */
export const updateLanguagesSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Nome do idioma deve ser uma string',
    })
    .min(2, 'Nome do idioma deve ter pelo menos 2 caracteres')
    .max(100, 'Nome do idioma deve ter no máximo 100 caracteres')
    .optional(),
  proficiency: z
    .string({
      invalid_type_error: 'Proficiência deve ser uma string',
    })
    .min(2, 'Proficiência deve ter pelo menos 2 caracteres')
    .max(50, 'Proficiência deve ter no máximo 50 caracteres')
    .optional(),
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type UpdateLanguagesDto = z.infer<typeof updateLanguagesSchema>;

