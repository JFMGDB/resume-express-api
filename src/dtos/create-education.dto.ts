import { z } from 'zod';

/**
 * Schema Zod para criação de uma educação
 * Valida os dados de entrada antes de processar
 */
export const createEducationSchema = z.object({
  peopleId: z
    .string({
      required_error: 'ID da pessoa é obrigatório',
      invalid_type_error: 'ID da pessoa deve ser uma string',
    })
    .min(1, 'ID da pessoa não pode estar vazio'),
  institution: z
    .string({
      required_error: 'Instituição é obrigatória',
      invalid_type_error: 'Instituição deve ser uma string',
    })
    .min(2, 'Instituição deve ter pelo menos 2 caracteres')
    .max(255, 'Instituição deve ter no máximo 255 caracteres'),
  degree: z
    .string({
      required_error: 'Grau é obrigatório',
      invalid_type_error: 'Grau deve ser uma string',
    })
    .min(2, 'Grau deve ter pelo menos 2 caracteres')
    .max(255, 'Grau deve ter no máximo 255 caracteres'),
  field_of_study: z
    .string({
      invalid_type_error: 'Área de estudo deve ser uma string',
    })
    .max(255, 'Área de estudo deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),
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
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type CreateEducationDto = z.infer<typeof createEducationSchema>;

