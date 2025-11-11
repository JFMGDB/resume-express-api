import { z } from 'zod';

/**
 * Schema Zod para atualização de uma certificação
 * Todos os campos são opcionais para permitir atualizações parciais
 */
export const updateCertificationsSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Nome da certificação deve ser uma string',
    })
    .min(2, 'Nome da certificação deve ter pelo menos 2 caracteres')
    .max(255, 'Nome da certificação deve ter no máximo 255 caracteres')
    .optional(),
  issuer: z
    .string({
      invalid_type_error: 'Emissor deve ser uma string',
    })
    .min(2, 'Emissor deve ter pelo menos 2 caracteres')
    .max(255, 'Emissor deve ter no máximo 255 caracteres')
    .optional(),
  issue_date: z
    .string({
      invalid_type_error: 'Data de emissão deve ser uma string',
    })
    .datetime('Data de emissão deve ser uma data válida no formato ISO 8601')
    .optional(),
  url: z
    .string({
      invalid_type_error: 'URL deve ser uma string',
    })
    .url('URL deve ser uma URL válida')
    .optional()
    .nullable(),
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type UpdateCertificationsDto = z.infer<typeof updateCertificationsSchema>;

