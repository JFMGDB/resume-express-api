import { z } from 'zod';

/**
 * Schema Zod para associação de skill a uma pessoa
 * Valida os dados de entrada antes de processar
 */
export const associateSkillSchema = z.object({
  peopleId: z.string({
    required_error: 'ID da pessoa é obrigatório',
    invalid_type_error: 'ID da pessoa deve ser uma string',
  }),
  skillId: z.string({
    required_error: 'ID da skill é obrigatório',
    invalid_type_error: 'ID da skill deve ser uma string',
  }),
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type AssociateSkillDto = z.infer<typeof associateSkillSchema>;

