import { Router } from 'express';
import { EducationController } from '../controllers/education.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { createEducationSchema } from '../dtos/create-education.dto';
import { updateEducationSchema } from '../dtos/update-education.dto';
import { educationParamsSchema } from '../dtos/education-params.dto';

const router = Router();
const educationController = new EducationController();

/**
 * POST /api/v1/education
 * Cria uma nova educação
 */
router.post(
  '/',
  authenticate,
  validate({ body: createEducationSchema }),
  educationController.create
);

/**
 * GET /api/v1/education/:id
 * Busca uma educação pelo ID
 */
router.get(
  '/:id',
  validate({
    params: educationParamsSchema,
  }),
  educationController.getById
);

// Nota: A rota GET /api/v1/people/:id/education será implementada nas rotas de people

/**
 * PUT /api/v1/education/:id
 * Atualiza uma educação existente
 */
router.put(
  '/:id',
  authenticate,
  validate({
    params: educationParamsSchema,
    body: updateEducationSchema,
  }),
  educationController.update
);

/**
 * DELETE /api/v1/education/:id
 * Deleta uma educação
 */
router.delete(
  '/:id',
  authenticate,
  validate({
    params: educationParamsSchema,
  }),
  educationController.delete
);

export default router;

