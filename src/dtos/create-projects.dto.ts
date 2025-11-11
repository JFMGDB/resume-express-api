import { z } from 'zod';

/**
 * Schema Zod para criação de um projeto
 * Valida os dados de entrada antes de processar
 */
export const createProjectsSchema = z.object({
  peopleId: z
    .string({
      required_error: 'ID da pessoa é obrigatório',
      invalid_type_error: 'ID da pessoa deve ser uma string',
    })
    .min(1, 'ID da pessoa não pode estar vazio'),
  name: z
    .string({
      required_error: 'Nome do projeto é obrigatório',
      invalid_type_error: 'Nome do projeto deve ser uma string',
    })
    .min(2, 'Nome do projeto deve ter pelo menos 2 caracteres')
    .max(255, 'Nome do projeto deve ter no máximo 255 caracteres'),
  description: z
    .string({
      required_error: 'Descrição é obrigatória',
      invalid_type_error: 'Descrição deve ser uma string',
    })
    .min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  url: z
    .string({
      invalid_type_error: 'URL deve ser uma string',
    })
    .url('URL deve ser uma URL válida')
    .optional()
    .nullable(),
  repository_url: z
    .string({
      invalid_type_error: 'URL do repositório deve ser uma string',
    })
    .url('URL do repositório deve ser uma URL válida')
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
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type CreateProjectsDto = z.infer<typeof createProjectsSchema>;

