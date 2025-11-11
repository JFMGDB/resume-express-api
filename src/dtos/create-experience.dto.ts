import { z } from 'zod';

/**
 * Schema Zod para criação de uma experiência
 * Valida os dados de entrada antes de processar
 */
export const createExperienceSchema = z.object({
  peopleId: z
    .string({
      required_error: 'ID da pessoa é obrigatório',
      invalid_type_error: 'ID da pessoa deve ser uma string',
    })
    .min(1, 'ID da pessoa não pode estar vazio'),
  company: z
    .string({
      required_error: 'Empresa é obrigatória',
      invalid_type_error: 'Empresa deve ser uma string',
    })
    .min(2, 'Empresa deve ter pelo menos 2 caracteres')
    .max(255, 'Empresa deve ter no máximo 255 caracteres'),
  position: z
    .string({
      required_error: 'Cargo é obrigatório',
      invalid_type_error: 'Cargo deve ser uma string',
    })
    .min(2, 'Cargo deve ter pelo menos 2 caracteres')
    .max(255, 'Cargo deve ter no máximo 255 caracteres'),
  start_date: z
    .string({
      required_error: 'Data de início é obrigatória',
      invalid_type_error: 'Data de início deve ser uma string',
    })
    .datetime('Data de início deve ser uma data válida no formato ISO 8601'),
  end_date: z
    .string({
      invalid_type_error: 'Data de término deve ser uma string',
    })
    .datetime('Data de término deve ser uma data válida no formato ISO 8601')
    .optional()
    .nullable(),
  description: z
    .string({
      invalid_type_error: 'Descrição deve ser uma string',
    })
    .optional()
    .nullable(),
  location: z
    .string({
      invalid_type_error: 'Localização deve ser uma string',
    })
    .max(255, 'Localização deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type CreateExperienceDto = z.infer<typeof createExperienceSchema>;

