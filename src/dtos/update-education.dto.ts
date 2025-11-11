import { z } from 'zod';

/**
 * Schema Zod para atualização de uma educação
 * Todos os campos são opcionais para permitir atualizações parciais
 */
export const updateEducationSchema = z.object({
  institution: z
    .string({
      invalid_type_error: 'Instituição deve ser uma string',
    })
    .min(2, 'Instituição deve ter pelo menos 2 caracteres')
    .max(255, 'Instituição deve ter no máximo 255 caracteres')
    .optional(),
  degree: z
    .string({
      invalid_type_error: 'Grau deve ser uma string',
    })
    .min(2, 'Grau deve ter pelo menos 2 caracteres')
    .max(255, 'Grau deve ter no máximo 255 caracteres')
    .optional(),
  field_of_study: z
    .string({
      invalid_type_error: 'Área de estudo deve ser uma string',
    })
    .max(255, 'Área de estudo deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),
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
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type UpdateEducationDto = z.infer<typeof updateEducationSchema>;

