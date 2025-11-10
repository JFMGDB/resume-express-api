import { Router } from 'express';
import { PeopleController } from '../controllers/people.controller';
import { validate } from '../middlewares/validation.middleware';
import { createPersonSchema } from '../dtos/create-person.dto';
import { updatePersonSchema } from '../dtos/update-person.dto';
import { personParamsSchema } from '../dtos/person-params.dto';

const router = Router();
const peopleController = new PeopleController();

/**
 * GET /api/v1/people
 * Lista todas as pessoas
 */
router.get('/', peopleController.getAll);

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
 * POST /api/v1/people
 * Cria uma nova pessoa
 */
router.post('/', validate({ body: createPersonSchema }), peopleController.create);

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

