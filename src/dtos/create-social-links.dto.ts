import { z } from 'zod';

/**
 * Schema Zod para criação de um link social
 * Valida os dados de entrada antes de processar
 */
export const createSocialLinksSchema = z.object({
  peopleId: z
    .string({
      required_error: 'ID da pessoa é obrigatório',
      invalid_type_error: 'ID da pessoa deve ser uma string',
    })
    .min(1, 'ID da pessoa não pode estar vazio'),
  platform: z
    .string({
      required_error: 'Plataforma é obrigatória',
      invalid_type_error: 'Plataforma deve ser uma string',
    })
    .min(2, 'Plataforma deve ter pelo menos 2 caracteres')
    .max(50, 'Plataforma deve ter no máximo 50 caracteres'),
  url: z
    .string({
      required_error: 'URL é obrigatória',
      invalid_type_error: 'URL deve ser uma string',
    })
    .url('URL deve ser uma URL válida')
    .max(500, 'URL deve ter no máximo 500 caracteres'),
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type CreateSocialLinksDto = z.infer<typeof createSocialLinksSchema>;

