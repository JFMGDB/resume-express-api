import { Router } from 'express';
import { PeopleController } from '../controllers/people.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { createPersonSchema } from '../dtos/create-person.dto';
import { updatePersonSchema } from '../dtos/update-person.dto';
import { personParamsSchema } from '../dtos/person-params.dto';
import { associateSkillSchema } from '../dtos/associate-skill.dto';
import { disassociateSkillSchema } from '../dtos/disassociate-skill.dto';

const router = Router();
const peopleController = new PeopleController();

/**
 * GET /api/v1/people
 * Lista todas as pessoas
 */
router.get('/', peopleController.getAll);

/**
 * POST /api/v1/people
 * Cria uma nova pessoa
 * Requer autenticação
 */
router.post(
  '/',
  authenticate,
  validate({ body: createPersonSchema }),
  peopleController.create
);

/**
 * POST /api/v1/people/associate-skill
 * Associa uma skill a uma pessoa
 * IMPORTANTE: Esta rota deve vir antes de /:id para evitar conflito de rotas
 * Requer autenticação
 */
router.post(
  '/associate-skill',
  authenticate,
  validate({ body: associateSkillSchema }),
  peopleController.associateSkill
);

/**
 * POST /api/v1/people/disassociate-skill
 * Desassocia uma skill de uma pessoa
 * IMPORTANTE: Esta rota deve vir antes de /:id para evitar conflito de rotas
 * Requer autenticação
 */
router.post(
  '/disassociate-skill',
  authenticate,
  validate({ body: disassociateSkillSchema }),
  peopleController.disassociateSkill
);

/**
 * GET /api/v1/people/:id/full
 * Busca uma pessoa pelo ID com todas as relações incluídas (currículo completo)
 * IMPORTANTE: Esta rota deve vir antes de /:id para evitar conflito de rotas
 */
router.get(
  '/:id/full',
  validate({
    params: personParamsSchema,
  }),
  peopleController.getFull
);

/**
 * GET /api/v1/people/:id
 * Busca uma pessoa pelo ID
 */
router.get(
  '/:id',
  validate({
    params: personParamsSchema,
  }),
  peopleController.getById
);

/**
 * PUT /api/v1/people/:id
 * Atualiza uma pessoa existente
 * Requer autenticação
 */
router.put(
  '/:id',
  authenticate,
  validate({
    params: personParamsSchema,
    body: updatePersonSchema,
  }),
  peopleController.update
);

/**
 * DELETE /api/v1/people/:id
 * Deleta uma pessoa
 * Requer autenticação
 */
router.delete(
  '/:id',
  authenticate,
  validate({
    params: personParamsSchema,
  }),
  peopleController.delete
);

export default router;

