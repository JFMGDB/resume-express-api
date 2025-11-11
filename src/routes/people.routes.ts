import { Router } from 'express';
import { PeopleController } from '../controllers/people.controller';
import { validate } from '../middlewares/validation.middleware';
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
 */
router.post('/', validate({ body: createPersonSchema }), peopleController.create);

/**
 * POST /api/v1/people/associate-skill
 * Associa uma skill a uma pessoa
 * IMPORTANTE: Esta rota deve vir antes de /:id para evitar conflito de rotas
 */
router.post(
  '/associate-skill',
  validate({ body: associateSkillSchema }),
  peopleController.associateSkill
);

/**
 * POST /api/v1/people/disassociate-skill
 * Desassocia uma skill de uma pessoa
 * IMPORTANTE: Esta rota deve vir antes de /:id para evitar conflito de rotas
 */
router.post(
  '/disassociate-skill',
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
 */
router.put(
  '/:id',
  validate({
    params: personParamsSchema,
    body: updatePersonSchema,
  }),
  peopleController.update
);

/**
 * DELETE /api/v1/people/:id
 * Deleta uma pessoa
 */
router.delete(
  '/:id',
  validate({
    params: personParamsSchema,
  }),
  peopleController.delete
);

export default router;

