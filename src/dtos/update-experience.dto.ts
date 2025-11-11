import { z } from 'zod';

/**
 * Schema Zod para atualização de uma experiência
 * Todos os campos são opcionais para permitir atualizações parciais
 */
export const updateExperienceSchema = z.object({
  company: z
    .string({
      invalid_type_error: 'Empresa deve ser uma string',
    })
    .min(2, 'Empresa deve ter pelo menos 2 caracteres')
    .max(255, 'Empresa deve ter no máximo 255 caracteres')
    .optional(),
  position: z
    .string({
      invalid_type_error: 'Cargo deve ser uma string',
    })
    .min(2, 'Cargo deve ter pelo menos 2 caracteres')
    .max(255, 'Cargo deve ter no máximo 255 caracteres')
    .optional(),
  start_date: z
    .string({
      invalid_type_error: 'Data de início deve ser uma string',
    })
    .datetime('Data de início deve ser uma data válida no formato ISO 8601')
    .optional(),
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
export type UpdateExperienceDto = z.infer<typeof updateExperienceSchema>;

