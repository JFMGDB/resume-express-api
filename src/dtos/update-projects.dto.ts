import { z } from 'zod';

/**
 * Schema Zod para atualização de um projeto
 * Todos os campos são opcionais para permitir atualizações parciais
 */
export const updateProjectsSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Nome do projeto deve ser uma string',
    })
    .min(2, 'Nome do projeto deve ter pelo menos 2 caracteres')
    .max(255, 'Nome do projeto deve ter no máximo 255 caracteres')
    .optional(),
  description: z
    .string({
      invalid_type_error: 'Descrição deve ser uma string',
    })
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .optional(),
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
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type UpdateProjectsDto = z.infer<typeof updateProjectsSchema>;

