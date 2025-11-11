import { z } from 'zod';

/**
 * Schema Zod para atualização de um link social
 * Todos os campos são opcionais para permitir atualizações parciais
 */
export const updateSocialLinksSchema = z.object({
  platform: z
    .string({
      invalid_type_error: 'Plataforma deve ser uma string',
    })
    .min(2, 'Plataforma deve ter pelo menos 2 caracteres')
    .max(50, 'Plataforma deve ter no máximo 50 caracteres')
    .optional(),
  url: z
    .string({
      invalid_type_error: 'URL deve ser uma string',
    })
    .url('URL deve ser uma URL válida')
    .max(500, 'URL deve ter no máximo 500 caracteres')
    .optional(),
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type UpdateSocialLinksDto = z.infer<typeof updateSocialLinksSchema>;

