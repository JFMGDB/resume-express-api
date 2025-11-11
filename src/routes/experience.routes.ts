import { Router } from 'express';
import { ExperienceController } from '../controllers/experience.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { createExperienceSchema } from '../dtos/create-experience.dto';
import { updateExperienceSchema } from '../dtos/update-experience.dto';
import { experienceParamsSchema } from '../dtos/experience-params.dto';

const router = Router();
const experienceController = new ExperienceController();

/**
 * POST /api/v1/experience
 * Cria uma nova experiência
 * Requer autenticação
 */
router.post(
  '/',
  authenticate,
  validate({ body: createExperienceSchema }),
  experienceController.create
);

/**
 * GET /api/v1/experience/:id
 * Busca uma experiência pelo ID
 */
router.get(
  '/:id',
  validate({
    params: experienceParamsSchema,
  }),
  experienceController.getById
);

// Nota: A rota GET /api/v1/people/:id/experience será implementada nas rotas de people

/**
 * PUT /api/v1/experience/:id
 * Atualiza uma experiência existente
 * Requer autenticação
 */
router.put(
  '/:id',
  authenticate,
  validate({
    params: experienceParamsSchema,
    body: updateExperienceSchema,
  }),
  experienceController.update
);

/**
 * DELETE /api/v1/experience/:id
 * Deleta uma experiência
 * Requer autenticação
 */
router.delete(
  '/:id',
  authenticate,
  validate({
    params: experienceParamsSchema,
  }),
  experienceController.delete
);

export default router;

