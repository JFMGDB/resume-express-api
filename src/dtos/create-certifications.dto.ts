import { z } from 'zod';

/**
 * Schema Zod para criação de uma certificação
 * Valida os dados de entrada antes de processar
 */
export const createCertificationsSchema = z.object({
  peopleId: z
    .string({
      required_error: 'ID da pessoa é obrigatório',
      invalid_type_error: 'ID da pessoa deve ser uma string',
    })
    .min(1, 'ID da pessoa não pode estar vazio'),
  name: z
    .string({
      required_error: 'Nome da certificação é obrigatório',
      invalid_type_error: 'Nome da certificação deve ser uma string',
    })
    .min(2, 'Nome da certificação deve ter pelo menos 2 caracteres')
    .max(255, 'Nome da certificação deve ter no máximo 255 caracteres'),
  issuer: z
    .string({
      required_error: 'Emissor é obrigatório',
      invalid_type_error: 'Emissor deve ser uma string',
    })
    .min(2, 'Emissor deve ter pelo menos 2 caracteres')
    .max(255, 'Emissor deve ter no máximo 255 caracteres'),
  issue_date: z
    .string({
      required_error: 'Data de emissão é obrigatória',
      invalid_type_error: 'Data de emissão deve ser uma string',
    })
    .datetime('Data de emissão deve ser uma data válida no formato ISO 8601'),
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
export type CreateCertificationsDto = z.infer<typeof createCertificationsSchema>;

